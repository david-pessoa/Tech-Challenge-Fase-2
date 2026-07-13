import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class DeletePostService {
  async execute(id: string, userId: string, userRole: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new AppError(404, 'Post não encontrado');
    }

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
