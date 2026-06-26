import { postRepository } from '../../repositories/PostRepository';

export class GetPostService {
  async execute(id: string) {
    const post = await postRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    return {
      postId: post.id,
      userId: post.user.id,
      titulo: post.titulo,
      descricao: post.descricao,
      conteudo: post.conteudo,
      dataCriacao: post.dataCriacao,
      dataModificacao: post.dataModificacao,
    };
  }
}

export const getPostService = new GetPostService();
