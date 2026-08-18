import { NextFunction, Request, Response } from 'express';
import { createCommentService} from '../services/comment/CreateCommentService';
import { getCommentService } from '../services/comment/GetCommentService';
import { listPostCommentsService } from '../services/comment/ListPostCommentsService';

export class CommentController {
  async create(request: Request, response: Response) {
    try {
      const postId = String(request.params.postId);

      await createCommentService.execute({
        ...request.body,
        userId: request.user!.id,
        postId
      });

      return response.status(201).json({
        message: 'Commentário criado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Dados inválidos',
      });
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const id = String(request.params.commentId);
      const comment = await getCommentService.execute(id);

      return response.status(200).json(comment);
    } catch (error) {
      return response.status(404).json({
        message: 'Comentário não encontrado',
      });
    }
  }

  async list(request: Request, response: Response) {
    const postId = String(request.params.postId);
    const postComments = await listPostCommentsService.execute(postId);

    return response.status(200).json(postComments);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    // try {
    //   const id = String(request.params.id);

    //   await updatePostService.execute(id, request.user!.id, request.user!.role.nome, {
    //     ...request.body,
    //     image: request.file?.buffer,
    //   });

    //   return response.status(200).json({
    //     message: 'Post atualizado com sucesso!',
    //   });
    // } catch (error) {
    //   return next(error);
    // }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    // try {
    //   const id = String(request.params.id);

    //   const result = await deletePostService.execute(id, request.user!.id, request.user!.role.nome);

    //   return response.status(200).json(result);
    // } catch (error) {
    //   return next(error);
    // }
  }
}

export const commentController = new CommentController();
