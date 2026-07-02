import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { postRepository } from '../repositories/PostRepository';
import { updatePostService } from '../services/post/UpdatePostService';

jest.mock('../repositories/PostRepository', () => ({
  postRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

describe('Post', () => {
  it('Deve criar um post corretamente', () => {
    const professor = new User();
    professor.id = 'professor-id';
    professor.nome = 'Ana Professora';

    const post = new Post();
    post.titulo = 'Introdução ao TypeScript';
    post.descricao = 'Conceitos iniciais da linguagem';
    post.conteudo = 'Conteúdo da aula sobre TypeScript';
    post.user = professor;

    expect(post.titulo).toBe('Introdução ao TypeScript');
    expect(post.descricao).toBe('Conceitos iniciais da linguagem');
    expect(post.conteudo).toBe('Conteúdo da aula sobre TypeScript');
    expect(post.user).toBe(professor);
  });
});


describe('Atualização de post', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve permitir que o professor atualize o próprio post', async () => {
    const professor = new User();
    professor.id = 'professor-1';

    const post = new Post();
    post.id = 'post-1';
    post.titulo = 'Título antigo';
    post.descricao = 'Descrição antiga';
    post.conteudo = 'Conteúdo antigo';
    post.user = professor;

    (postRepository.findOne as jest.Mock).mockResolvedValue(post);
    (postRepository.save as jest.Mock).mockResolvedValue(post);

    const resultado = await updatePostService.execute(
      'post-1',
      'professor-1',
      'PROFESSOR',
      {
        titulo: 'Título atualizado',
      }
    );

    expect(resultado.titulo).toBe('Título atualizado');
    expect(postRepository.save).toHaveBeenCalledWith(post);
  });
});