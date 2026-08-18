import { commentRepository } from "../../repositories/CommentRepository";

export class GetCommentService {
  async execute(id: string) {
    const comment = await commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        post: true,
        parentComment: true,
      },
    });

    if (!comment) {
      throw new Error('Comentário não encontrado');
    }

    return {
      commentId: comment.id,
      parentCommentId: comment.parentComment?.id,
      postId: comment.post.id,
      userId: comment.user.id,
      conteudo: comment.conteudo,
      dataCriacao: comment.dataCriacao,
      dataModificacao: comment.dataModificacao,
    };
  }
}

export const getCommentService = new GetCommentService();