import { NextFunction, Request, Response } from 'express';
import { createPostService } from '../services/post/CreatePostService';
import { getPostService } from '../services/post/GetPostService';
import { listPostsService } from '../services/post/ListPostsService';
import { updatePostService } from '../services/post/UpdatePostService';
import { deletePostService } from '../services/post/DeletePostService';
import { searchPostsService } from '../services/post/SearchPostsService';
import { AppError } from '../middlewares/errorHandler';
import { markPostAsViewedService } from '../services/post/MarkPostAsViewedService';

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

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.id);

      await updatePostService.execute(id, request.user!.id, request.body);

      return response.status(200).json({
        message: 'Post atualizado com sucesso!',
      });
    } catch (error) {
      return next(error);
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

  async search(request: Request, response: Response, next: NextFunction) {
    try {
      const termo = String(request.query.termo ?? '');
      const posts = await searchPostsService.execute(termo);

      return response.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  }
  
  async markAsViewed(request: Request, response: Response, next: NextFunction) {
    try {
      const postId = String(request.params.postId);
      const userId = String(request.params.userId);

      if (request.user!.id !== userId) {
        throw new AppError(403, 'Acesso não autorizado');
      }

      const result = await markPostAsViewedService.execute(postId, userId);

      return response.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

export const postController = new PostController();
