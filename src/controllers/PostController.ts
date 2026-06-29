import { Request, Response } from 'express';
import { createPostService } from '../services/post/CreatePostService';
import { getPostService } from '../services/post/GetPostService';
import { listPostsService } from '../services/post/ListPostsService';
import { updatePostService } from '../services/post/UpdatePostService';
import { deletePostService } from '../services/post/DeletePostService';

export class PostController {
  async create(request: Request, response: Response) {
    try {
      await createPostService.execute({
        ...request.body,
        userId: request.user!.id,
      });

      return response.status(201).json({
        message: 'Post criado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Dados inválidos',
      });
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const id = String(request.params.id);
      const post = await getPostService.execute(id);
      return response.status(200).json(post);
    } catch (error) {
      return response.status(404).json({
        message: 'Post não encontrado',
      });
    }
  }

  async list(_request: Request, response: Response) {
    const posts = await listPostsService.execute();
    return response.status(200).json(posts);
  }

  async update(request: Request, response: Response) {
    try {
      const id = String(request.params.id);
      const post = await updatePostService.execute(id, request.body);
      return response.status(200).json(post);
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao atualizar post',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = String(request.params.id);
      const result = await deletePostService.execute(id);
      return response.status(200).json(result);
    } catch (error) {
      return response.status(404).json({
        message: 'Post não encontrado',
      });
    }
  }
}

export const postController = new PostController();
