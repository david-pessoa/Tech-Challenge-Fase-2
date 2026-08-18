export interface CreatePostDTO {
  titulo: string;
  descricao: string;
  conteudo: string;
  userId: string;
  image?: Buffer | null;
  subjectId?: string;
  subjectName?: string;
}
