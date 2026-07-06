import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { postRepository } from '../repositories/PostRepository';
import { updatePostService } from '../services/post/UpdatePostService';
import { listPostsService } from '../services/post/ListPostsService';
import { deletePostService } from '../services/post/DeletePostService';

jest.mock('../repositories/PostRepository', () => ({
    postRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    },
}));

describe('Post', () => {
    it('Deve criar um post corretamente', () => {
        const creator = new User();
        creator.id = 'bd1de63c-5df5-4dfd-9736-ace2d7f092b1';
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
        creator.id = 'bd1de63c-5df5-4dfd-9736-ace2d7f092b1';

        const post = new Post();
        post.id = 'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4';
        post.titulo = 'Título antigo';
        post.descricao = 'Descrição antiga';
        post.conteudo = 'Conteúdo antigo';
        post.user = creator;

        (postRepository.findOne as jest.Mock).mockResolvedValue(post);
        (postRepository.save as jest.Mock).mockResolvedValue(post);

        const updatePost = await updatePostService.execute(
            'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4',
            'bd1de63c-5df5-4dfd-9736-ace2d7f092b1',
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
        creator.id = 'bd1de63c-5df5-4dfd-9736-ace2d7f092b1';

        const firstPost = new Post();
        firstPost.id = 'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4';
        firstPost.titulo = 'TypeScript';
        firstPost.descricao = 'Introdução ao TypeScript';
        firstPost.conteudo = 'Conteúdo da aula';
        firstPost.dataCriacao = new Date('2026-07-01');
        firstPost.dataModificacao = new Date('2026-07-01');
        firstPost.user = creator;

        const secondPost = new Post();
        secondPost.id = '9d92fefb-4610-4b41-ab7c-1841cd0275f5';
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
        expect(listPosts[0].postId).toBe('9d92fefb-4610-4b41-ab7c-1841cd0275f5');
        expect(listPosts[1].postId).toBe('cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4');
        expect(postRepository.find).toHaveBeenCalled();
    });
});

describe('Exclusão de post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve permitir que o criador exclua o próprio post', async () => {
        const creator = new User();
        creator.id = 'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4';

        const post = new Post();
        post.id = '9d92fefb-4610-4b41-ab7c-1841cd0275f5';
        post.titulo = 'Post para exclusão';
        post.descricao = 'Descrição do post';
        post.conteudo = 'Conteúdo do post';
        post.user = creator;

        (postRepository.findOne as jest.Mock).mockResolvedValue(post);
        (postRepository.remove as jest.Mock).mockResolvedValue(post);

        const result = await deletePostService.execute(
            '9d92fefb-4610-4b41-ab7c-1841cd0275f5',
            'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4',
            'PROFESSOR'
        );

        expect(result).toEqual({
            message: 'Post removido com sucesso',
        });

        expect(postRepository.remove).toHaveBeenCalledWith(post);
    });



    it('Não deve permitir que outro professor atualize o post', async () => {
        const creator = new User();
        creator.id = '9d92fefb-4610-4b41-ab7c-1841cd0275f5';

        const post = new Post();
        post.id = 'b7436d95-91e3-48ce-826b-dda58ef02eca';
        post.titulo = 'Título antigo';
        post.descricao = 'Descrição antiga';
        post.conteudo = 'Conteúdo antigo';
        post.user = creator;

        (postRepository.findOne as jest.Mock).mockResolvedValue(post);

        await expect(
            updatePostService.execute(
                'b7436d95-91e3-48ce-826b-dda58ef02eca',
                '5a0e25a2-afa5-44e1-b519-4d1e2139725a',
                'PROFESSOR',
                {
                    titulo: 'Tentativa de alteração',
                }
            )
        ).rejects.toMatchObject({
            statusCode: 403,
            message: 'Acesso não autorizado',
        });

        expect(postRepository.save).not.toHaveBeenCalled();
    });


    it('Não deve permitir que outro professor exclua o post', async () => {
        const creator = new User();
        creator.id = '5a0e25a2-afa5-44e1-b519-4d1e2139725a';

        const post = new Post();
        post.id = 'f973021d-39f8-43b0-81cf-986557959d95';
        post.titulo = 'Post de outro professor';
        post.descricao = 'Descrição do post';
        post.conteudo = 'Conteúdo do post';
        post.user = creator;

        (postRepository.findOne as jest.Mock).mockResolvedValue(post);

        await expect(
            deletePostService.execute(
                'f973021d-39f8-43b0-81cf-986557959d95',
                '86c0ca58-c3f6-4fe7-8e0b-12df89530ac7',
                'PROFESSOR'
            )
        ).rejects.toMatchObject({
            statusCode: 403,
            message: 'Acesso não autorizado',
        });

        expect(postRepository.remove).not.toHaveBeenCalled();
    });

});
