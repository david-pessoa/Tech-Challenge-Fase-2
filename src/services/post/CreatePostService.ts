import { CreatePostDTO } from '../../dto/CreatePostDTO';
import { postRepository } from '../../repositories/PostRepository';
import { userRepository } from '../../repositories/UserRepository';

export class CreatePostService {
  async execute(post: CreatePostDTO) {
    if (!post.userId) {
      throw new Error('Usuário é obrigatório');
    }

    const user = await userRepository.findOne({
      where: { id: post.userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const newPost = postRepository.create({
      titulo: post.titulo,
      descricao: post.descricao,
      conteudo: post.conteudo,
      user,
    });

    await postRepository.save(newPost);

    return newPost;
  }
}

export const createPostService = new CreatePostService();
