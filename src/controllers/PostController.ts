import { Request, Response } from "express";
import { createPostService } from "../services/post/CreatePostService";

export class PostController {
  async create(request: Request, response: Response) {
    try {
      await createPostService.execute(request.body);

      return response.status(201).json({
        message: "Post criado com sucesso!",
      });
    } catch (error) {
      return response.status(400).json({
        message: "Dados inválidos",
      });
    }
  }
}

export const postController = new PostController();