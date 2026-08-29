import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class GetPostImageService {
  async execute(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new AppError(404, 'Post não encontrado');
    }

    const post = await postRepository.findOne({
      where: { id },
      relations: {
        user: true,
        subject: true,
      },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    return {
      postId: post.id,
      titulo: post.titulo,
      image: post.image ? post.image : null,
    };
  }
}

export const getPostImageService = new GetPostImageService();
