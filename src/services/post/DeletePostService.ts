import { postRepository } from '../../repositories/PostRepository';

export class DeletePostService {
    async execute(id: string) {
        // Busca o post pelo ID
        const post = await postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new Error('Post não encontrado');
        }

        // Remove o post do banco
        await postRepository.remove(post);

        return { message: 'Post removido com sucesso' };
    }
}

export const deletePostService = new DeletePostService();