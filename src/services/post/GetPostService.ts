import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class GetPostService {
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
      userId: post.user ? post.user.id : null,
      titulo: post.titulo,
      descricao: post.descricao,
      conteudo: post.conteudo,
      image: post.image ? `/api/posts/${post.id}/image` : null,
      subject: {
        id: post.subject.id,
        nome: post.subject.nome,
      },
      dataCriacao: post.dataCriacao,
      dataModificacao: post.dataModificacao,
    };
  }
}

export const getPostService = new GetPostService();
