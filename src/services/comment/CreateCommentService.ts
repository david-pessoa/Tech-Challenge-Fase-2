import { CreateCommentDTO } from '../../dto/CreateCommentDTO';
import { AppError } from '../../middlewares/errorHandler';
import { commentRepository } from '../../repositories/CommentRepository';
import { postRepository } from '../../repositories/PostRepository';
import { userRepository } from '../../repositories/UserRepository';

export class CreateCommentService {
  async execute(comment: CreateCommentDTO) {
    if (!comment.userId) {
      throw new Error('Usuário é obrigatório');
    }

    if (!comment.postId) {
      throw new Error('Post é obrigatório');
    }

    let parentComment = null;
    if (comment?.parentCommentId) {
      parentComment = await commentRepository.findOne({
        where: { id: comment.parentCommentId },
      });
      if (!parentComment)
        throw new Error('Comentário pai fornecido não foi encontrado é obrigatório');
    }

    const user = await userRepository.findOne({
      where: { id: comment.userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const post = await postRepository.findOne({
      where: { id: comment.postId },
    });

    if (!post) {
      throw new Error('Post não encontrado');
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
