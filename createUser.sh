#!/usr/bin/env bash
set -euo pipefail

# Carrega o arquivo .env
set -a
source .env
set +a

DB_TARGET="${1:-${DB_TARGET:-local}}"
case "$DB_TARGET" in
  local)
    DB_CONNECTION_HOST="${DB_HOST_LOCAL:-localhost}"
    DB_CONNECTION_PORT="${DB_PORT_LOCAL:-5432}"
    PSQL_RUNNER=()
    ;;
  docker)
    DB_CONNECTION_HOST="${DB_HOST_DOCKER:-postgres}"
    DB_CONNECTION_PORT="${DB_PORT_DOCKER:-5432}"
    if command -v docker >/dev/null 2>&1; then
      PSQL_RUNNER=(docker exec -i postgres_db)
    elif command -v docker-compose >/dev/null 2>&1; then
      PSQL_RUNNER=(docker-compose exec -T postgres)
    else
      echo "Erro: docker ou docker-compose nao encontrado no PATH."
      exit 1
    fi
    ;;
  *)
    echo "Uso: $0 [local|docker]"
    exit 1
    ;;
esac

export PGPASSWORD="$DB_PASSWORD"

echo "Cadastro de Usuários"

read -r -p "Digite a matrícula do usuário: " matricula
read -r -p "Digite o nome do usuário: " nome
read -r -s -p "Digite a senha do usuário: " senha
echo
read -r -p "Digite o nome da role [ADMIN]: " role_name

role_name=${role_name:-ADMIN}

if [ "$DB_TARGET" = "local" ] && ! command -v psql >/dev/null 2>&1; then
  echo "Erro: psql não encontrado no PATH."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Erro: node não encontrado no PATH."
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "Erro: npx não encontrado no PATH."
  exit 1
fi

senha_hash=$(
  node -e "const bcrypt = require('bcryptjs'); const senha = process.argv[1]; console.log(bcrypt.hashSync(senha, 10));" "$senha"
)

run_psql() {
  if [ "$DB_TARGET" = "docker" ]; then
    PGPASSWORD="$DB_PASSWORD" "${PSQL_RUNNER[@]}" psql \
      -U "$DB_USERNAME" -d "$DB_DATABASE" "$@"
  else
    PGPASSWORD="$DB_PASSWORD" psql \
      -h "$DB_CONNECTION_HOST" -p "$DB_CONNECTION_PORT" \
      -U "$DB_USERNAME" -d "$DB_DATABASE" "$@"
  fi
}

role_id=$(
  run_psql -tA -c "SELECT id FROM roles WHERE nome = '$role_name' LIMIT 1;"
)

if [ -z "$role_id" ]; then
  echo "Erro: role '$role_name' não encontrada no banco."
  exit 1
fi

run_psql \
  -c "INSERT INTO users (matricula, nome, senha, role_id) VALUES ('$matricula', '$nome', '$senha_hash', '$role_id');"

echo "Usuário cadastrado com sucesso."
