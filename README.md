# Executando a aplicação
## Ambiente de desenvolvimento:

```bash
npm run dev
```

Execute as migrations com:
```bash
npm run build
npm migration:run
```

## Executar containers docker
```bash
docker compose up -d --build
```

## Verifique os containers
```bash
docker ps
```

## Parar os containers docker
```bash
docker compose down
```