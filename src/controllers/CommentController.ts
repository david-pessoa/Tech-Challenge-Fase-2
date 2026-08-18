import { NextFunction, Request, Response } from 'express';
import { createCommentService } from '../services/comment/CreateCommentService';
import { getCommentService } from '../services/comment/GetCommentService';
import { listPostCommentsService } from '../services/comment/ListPostCommentsService';
import { updateCommentService } from '../services/comment/UpdateCommentService';
import { deleteCommentService } from '../services/comment/DeleteCommentService';

export class CommentController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const postId = String(request.params.postId);

      await createCommentService.execute({
        ...request.body,
        userId: request.user!.id,
        postId,
      });

      return response.status(201).json({
        message: 'Commentário criado com sucesso!',
      });
    } catch (error) {
      return next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.commentId);
      const comment = await getCommentService.execute(id);

      return response.status(200).json(comment);
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const postId = String(request.params.postId);
      const postComments = await listPostCommentsService.execute(postId);
      return response.status(200).json(postComments);
      
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const CommentId = String(request.params.commentId);

      await updateCommentService.execute(CommentId, request.user!.id, request.body);

      return response.status(200).json({
        message: 'Comentário atualizado com sucesso!',
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.commentId);

      const result = await deleteCommentService.execute(
        id,
        request.user!.id,
        request.user!.role.nome
      );

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

export const commentController = new CommentController();
