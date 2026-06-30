import { ILike } from 'typeorm';

import { AppError } from '../../middlewares/errorHandler';
import { postRepository } from '../../repositories/PostRepository';

export class SearchPostsService {
  async execute(termo: string) {
    const termoBusca = termo.trim();

    if (!termoBusca) {
      throw new AppError(400, 'Termo de busca inválido.');
    }

    const posts = await postRepository.find({
      where: [
        { titulo: ILike(`%${termoBusca}%`) },
        { descricao: ILike(`%${termoBusca}%`) },
        { conteudo: ILike(`%${termoBusca}%`) },
      ],
      relations: { user: true },
      order: { dataCriacao: 'ASC' },
    });

    return posts.map(post => ({
      postId: post.id,
      userId: post.user.id,
      titulo: post.titulo,
      descricao: post.descricao,
      conteudo: post.conteudo,
      dataCriacao: post.dataCriacao,
      dataModificacao: post.dataModificacao,
    }));
  }
}

export const searchPostsService = new SearchPostsService();
