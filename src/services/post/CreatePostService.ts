import { CreatePostDTO } from '../../dto/CreatePostDTO';
import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';
import { subjectRepository } from '../../repositories/SubjectRepository';
import { userRepository } from '../../repositories/UserRepository';

export class CreatePostService {
  async execute(post: CreatePostDTO) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!post.userId) {
      throw new AppError(400, 'Usuário é obrigatório');
    }

    const user = await userRepository.findOne({
      where: { id: post.userId },
    });

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    if (!post.subjectId && !post.subjectName) {
      throw new AppError(400, 'Matéria é obrigatória');
    }

    if (post.subjectId && !uuidRegex.test(post.subjectId)) {
      throw new AppError(400, 'ID de matéria inválido');
    }

    const subject = post.subjectId
      ? await subjectRepository.findOne({
        where: { id: post.subjectId },
      })
      : await subjectRepository.findOne({
        where: { nome: post.subjectName! },
      });

    if (!subject) {
      throw new AppError(404, 'Matéria não encontrada');
    }

    const newPost = postRepository.create({
      titulo: post.titulo,
      descricao: post.descricao,
      conteudo: post.conteudo,
      image: post.image ?? null,
      user,
      subject,
    });

    await postRepository.save(newPost);

    return newPost;
  }
}

export const createPostService = new CreatePostService();
