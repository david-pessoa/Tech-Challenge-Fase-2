import { UpdatePostDTO } from '../../dto/UpdatePostDTO';
import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class UpdatePostService {
  async execute(id: string, userId: string, dados: UpdatePostDTO) {
    const post = await postRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new AppError(404, 'Post não encontrado');
    }

    if (post.user.id !== userId) {
      throw new AppError(403, 'Acesso não autorizado');
    }

    if (dados.titulo) post.titulo = dados.titulo;
    if (dados.descricao) post.descricao = dados.descricao;
    if (dados.conteudo) post.conteudo = dados.conteudo;

    await postRepository.save(post);

    return post;
  }
}

export const updatePostService = new UpdatePostService();
