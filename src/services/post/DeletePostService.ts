import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class DeletePostService {
  async execute(id: string, userId: string, userRole: string) {
    const post = await postRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    const isAdmin = userRole === 'ADMIN';
    const isPostCreator = post.user.id === userId;

    if (!isAdmin && !isPostCreator) {
      throw new AppError(403, 'Acesso não autorizado');
    }

    await postRepository.remove(post);

    return { message: 'Post removido com sucesso' };
  }
}

export const deletePostService = new DeletePostService();
