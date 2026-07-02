import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { postRepository } from '../repositories/PostRepository';
import { updatePostService } from '../services/post/UpdatePostService';
import { listPostsService } from '../services/post/ListPostsService';

jest.mock('../repositories/PostRepository', () => ({
    postRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
    },
}));

describe('Post', () => {
    it('Deve criar um post corretamente', () => {
        const creator = new User();
        creator.id = 'creator-id';
        creator.nome = 'Ana Professora';

        const post = new Post();
        post.titulo = 'Introdução ao TypeScript';
        post.descricao = 'Conceitos iniciais da linguagem';
        post.conteudo = 'Conteúdo da aula sobre TypeScript';
        post.user = creator;

        expect(post.titulo).toBe('Introdução ao TypeScript');
        expect(post.descricao).toBe('Conceitos iniciais da linguagem');
        expect(post.conteudo).toBe('Conteúdo da aula sobre TypeScript');
        expect(post.user).toBe(creator);
    });
});


describe('Atualização de post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve permitir que o creator atualize o próprio post', async () => {
        const creator = new User();
        creator.id = 'creator-1';

        const post = new Post();
        post.id = 'post-1';
        post.titulo = 'Título antigo';
        post.descricao = 'Descrição antiga';
        post.conteudo = 'Conteúdo antigo';
        post.user = creator;

        (postRepository.findOne as jest.Mock).mockResolvedValue(post);
        (postRepository.save as jest.Mock).mockResolvedValue(post);

        const updatePost = await updatePostService.execute(
            'post-1',
            'creator-1',
            'creator',
            {
                titulo: 'Título atualizado',
            }
        );

        expect(updatePost.titulo).toBe('Título atualizado');
        expect(postRepository.save).toHaveBeenCalledWith(post);
    });
});

describe('Listagem de posts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar todos os posts', async () => {
        const creator = new User();
        creator.id = 'creator-1';

        const firstPost = new Post();
        firstPost.id = 'post-1';
        firstPost.titulo = 'TypeScript';
        firstPost.descricao = 'Introdução ao TypeScript';
        firstPost.conteudo = 'Conteúdo da aula';
        firstPost.dataCriacao = new Date('2026-07-01');
        firstPost.dataModificacao = new Date('2026-07-01');
        firstPost.user = creator;

        const secondPost = new Post();
        secondPost.id = 'post-2';
        secondPost.titulo = 'Node.js';
        secondPost.descricao = 'Introdução ao Node.js';
        secondPost.conteudo = 'Conteúdo da aula';
        secondPost.dataCriacao = new Date('2026-07-02');
        secondPost.dataModificacao = new Date('2026-07-02');
        secondPost.user = creator;

        (postRepository.find as jest.Mock).mockResolvedValue([
            secondPost,
            firstPost,
        ]);

        const listPosts = await listPostsService.execute();

        expect(listPosts).toHaveLength(2);
        expect(listPosts[0].postId).toBe('post-2');
        expect(listPosts[1].postId).toBe('post-1');
        expect(postRepository.find).toHaveBeenCalled();
    });
});