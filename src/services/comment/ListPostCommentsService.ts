import { commentRepository } from '../../repositories/CommentRepository';
import { postRepository } from '../../repositories/PostRepository';

export class ListPostCommentsService {
  async execute(id: string) {
    const post = await postRepository.findOne({
      where: { id },
      relations: {
        comments: true,
      },
    });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    console.log(post.comments);

    const result = await Promise.all(
      post.comments.map(async comment => {
        const commentData = await commentRepository.findOne({
          where: { id: comment.id },
          relations: {
            user: true,
          },
        });

        return {
          id: comment.id,
          parentComment: commentData?.parentComment?.id,
          user: commentData?.user.nome,
          conteudo: comment.conteudo,
          dataCriacao: comment.dataCriacao,
          dataModificacao: comment.dataModificacao,
        };
      })
    );

    return result;
  }
}

export const listPostCommentsService = new ListPostCommentsService();
