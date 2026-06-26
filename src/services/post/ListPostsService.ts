import { postRepository } from '../../repositories/PostRepository';

export class ListPostsService {
  async execute() {
    const posts = await postRepository.find({
      relations: {
        user: true,
      },
      order: {
        dataCriacao: 'DESC',
      },
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

export const listPostsService = new ListPostsService();
