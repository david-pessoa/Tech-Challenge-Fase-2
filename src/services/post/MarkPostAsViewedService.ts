import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';
import { postViewRepository } from '../../repositories/PostViewRepository';
import { userRepository } from '../../repositories/UserRepository';

export class MarkPostAsViewedService {
  async execute(postId: string, userId: string) {

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(postId)) {
      throw new AppError(400, 'ID de post inválido');
    }
    
    if (!uuidRegex.test(userId)) {
      throw new AppError(400, 'ID de usuário inválido');
    }

    const post = await postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const viewExists = await postViewRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (viewExists) {
      return { result: true };
    }

    const view = postViewRepository.create({
      post,
      user,
    });

    await postViewRepository.save(view);

    return { result: true };
  }
}

export const markPostAsViewedService = new MarkPostAsViewedService();
