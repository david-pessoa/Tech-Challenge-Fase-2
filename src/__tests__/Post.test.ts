import { Post } from '../entities/Post';
import { User } from '../entities/User';

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