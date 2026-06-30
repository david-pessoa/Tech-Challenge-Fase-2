import { UpdatePostDTO } from '../../dto/UpdatePostDTO';
import { postRepository } from '../../repositories/PostRepository';

export class UpdatePostService {
    async execute(id: string, dados: UpdatePostDTO) {
        // Busca o post pelo ID
        const post = await postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new Error('Post não encontrado');
        }

        // Atualiza só os campos que foram enviados
        if (dados.titulo) post.titulo = dados.titulo;
        if (dados.descricao) post.descricao = dados.descricao;
        if (dados.conteudo) post.conteudo = dados.conteudo;

        await postRepository.save(post);

        return post;
    }
}

export const updatePostService = new UpdatePostService();