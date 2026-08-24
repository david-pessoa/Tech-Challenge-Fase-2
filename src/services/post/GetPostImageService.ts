import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class GetPostImageService {
  async execute(id: string) {
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
