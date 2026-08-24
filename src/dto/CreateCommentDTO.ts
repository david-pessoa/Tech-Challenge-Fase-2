export interface CreateCommentDTO {
  parentCommentId?: string | null;
  postId: string;
  userId: string;
  conteudo: string;
}