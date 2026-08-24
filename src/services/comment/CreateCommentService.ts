import { CreateCommentDTO } from '../../dto/CreateCommentDTO';
import { AppError } from '../../middlewares/errorHandler';
import { commentRepository } from '../../repositories/CommentRepository';
import { postRepository } from '../../repositories/PostRepository';
import { userRepository } from '../../repositories/UserRepository';

export class CreateCommentService {
  async execute(comment: CreateCommentDTO) {
    if (!comment.userId) {
      throw new AppError(400, 'Usuário é obrigatório');
    }

    if (!comment.postId) {
      throw new AppError(400, 'Post é obrigatório');
    }

    const user = await userRepository.findOne({
      where: { id: comment.userId },
    });

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const post = await postRepository.findOne({
      where: { id: comment.postId },
      relations: {
        user: true,
      },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    // Se o comentário é filho de outro comentário (ou seja, uma resposta), ele deve ser do autor do post. Senão, impede a criação
    let parentComment = null;
    if (comment?.parentCommentId) {
      parentComment = await commentRepository.findOne({
        where: { id: comment.parentCommentId },
      });
      if (!parentComment)
        throw new AppError(404, 'Comentário pai fornecido não foi encontrado. Ele é obrigatório');

      if (post.user.id !== comment.userId)
        throw new AppError(403, 'Somente o autor do post pode responder a comentários do post');
    }

    const newComment = commentRepository.create({
      parentComment,
      post,
      user,
      conteudo: comment.conteudo,
    });

    await commentRepository.save(newComment);

    return newComment;
  }
}

export const createCommentService = new CreateCommentService();
