import { AppError } from '../../middlewares/errorHandler';
import { commentRepository } from '../../repositories/CommentRepository';
import { postRepository } from '../../repositories/PostRepository';
import { IsNull } from 'typeorm';

export class ListPostCommentsService {
  async execute(id: string) {
    const post = await postRepository.findOne({
      where: { id },
      relations: {
        comments: true,
      },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    const result = await Promise.all(
      post.comments.map(async comment => {
        const commentData = await commentRepository.findOne({
          where: { id: comment.id, parentComment: IsNull() },
          relations: {
            user: true,
            childComment: true,
            parentComment: true,
          },
        });

        // Se o comentário tem um comentário pai, retorna nulo
        if(commentData == null)
          return null

        return {
          id: commentData?.id,
          childComment: commentData?.childComment,
          user: commentData?.user.nome,
          conteudo: commentData?.conteudo,
          dataCriacao: commentData?.dataCriacao,
          dataModificacao: commentData?.dataModificacao,
        };
      })
    );

    // Retira valores nulos da lista
    const filteredResult = result.filter(data => data != null);
    return filteredResult;
  }
}

export const listPostCommentsService = new ListPostCommentsService();
