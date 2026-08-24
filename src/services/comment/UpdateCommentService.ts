import { UpdateCommentDTO } from '../../dto/UpdateCommentDTO';
import { AppError } from '../../middlewares/errorHandler';
import { commentRepository } from '../../repositories/CommentRepository';
import { userRepository } from '../../repositories/UserRepository';

export class UpdateCommentService {
  async execute(commentId: string, userId: string, dados: UpdateCommentDTO) {
    const comment = await commentRepository.findOne({
      where: { id: commentId },
      relations: {
        user: true,
      },
    });

    if (!comment) {
      throw new AppError(404, 'Comentário não encontrado');
    }

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true
      }
    });

    if (!user) {
      throw new AppError(404, 'Autor do comentário não encontrado');
    }

    if (comment.user.id !== user.id && user.role.nome !== 'ADMIN') {
      throw new AppError(403, 'Somente o autor do comentário pode editar seus próprios comentários');
    }

    if (dados.conteudo) comment.conteudo = dados.conteudo;

    await commentRepository.save(comment);
    return comment;
  }
}

export const updateCommentService = new UpdateCommentService();
