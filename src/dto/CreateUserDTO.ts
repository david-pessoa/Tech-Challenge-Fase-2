// Define o formato dos dados esperados para cadastro de usuário
export interface CreateUserDTO {
  matricula: string;
  nome: string;
  birthDate?: Date;
  senha: string;
  role?: string; // opcional — se não informado, usa ALUNO por padrão
  image?: Buffer | null;
}
