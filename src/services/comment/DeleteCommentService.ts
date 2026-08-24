import { AppError } from '../../middlewares/errorHandler';
import { commentRepository } from '../../repositories/CommentRepository';
import { postRepository } from '../../repositories/PostRepository';

export class DeleteCommentService {
  async execute(id: string, userId: string, userRole: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new AppError(404, 'Comentário não encontrado');
    }

    const comment = await commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        post: true,
      },
    });

    if (!comment) {
      throw new AppError(404, 'Comentário não encontrado');
    }

    const post = await postRepository.findOne({
      where: { id: comment.post.id },
      relations: {
        user: true,
      },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    // Apenas habilita a exclusão se o usuáriuo for ADMIN OU o criador do post OU for o autor do comentário
    const isAdmin = userRole === 'ADMIN';
    const isPostCreator =  post.user.id === userId;
    const isCommentCreator = comment.user.id === userId;
    if (!isAdmin && !isPostCreator && !isCommentCreator) {
      throw new AppError(403, 'Acesso não autorizado');
    }

    await commentRepository.remove(comment);

    return { message: 'Comentário removido com sucesso' };
  }
}

export const deleteCommentService = new DeleteCommentService();
