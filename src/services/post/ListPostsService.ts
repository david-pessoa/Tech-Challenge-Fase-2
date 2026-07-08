import { postRepository } from '../../repositories/PostRepository';

export class ListPostsService {
  async execute(userId: string, userRole: string) {
    const posts = await postRepository.find({
      relations: {
        user: {
          role: true,
        },
        visualizacoes: {
          user: {
            role: true,
          },
        },
      },
      order: {
        dataCriacao: 'DESC',
      },
    });

    return posts.map(post => {
      const visualizacoes =
        post.visualizacoes?.map(view => ({
          nome: view.user.nome,
          tipoUsuario: view.user.role.nome,
          viewedAt: view.viewedAt,
        })) ?? [];

      const basePost = {
        postId: post.id,
        titulo: post.titulo,
        descricao: post.descricao,
        conteudo: post.conteudo,
        dataCriacao: post.dataCriacao,
        dataModificacao: post.dataModificacao,
        criadoPor: {
          nome: post.user.nome,
          tipoUsuario: post.user.role.nome,
        },
      };

      if (userRole === 'ALUNO') {
        return {
          ...basePost,
          foiVisto:
            post.visualizacoes?.some(view => view.user.id === userId) ?? false,
        };
      }

      if (userRole === 'PROFESSOR') {
        const isPostCreator = post.user.id === userId;

        return {
          ...basePost,
          visualizacoes: isPostCreator ? visualizacoes : [],
        };
      }

      return {
        ...basePost,
        visualizacoes,
      };
    });
  }
}

export const listPostsService = new ListPostsService();