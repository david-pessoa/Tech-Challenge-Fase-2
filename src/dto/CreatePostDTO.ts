export interface CreatePostDTO {
  titulo: string;
  descricao: string;
  conteudo: string;
  userId: string;
  image?: string;
  subjectId: string;
}
