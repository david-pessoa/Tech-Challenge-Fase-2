import { Request, Response } from "express";
import { createPostService } from "../services/post/CreatePostService";
import { getPostService } from "../services/post/GetPostService";
import { listPostsService } from "../services/post/ListPostsService";

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

  async findById(request: Request, response: Response) {
    try {
      const id = String(request.params.id);

      const post = await getPostService.execute(id);

      return response.status(200).json(post);
    } catch (error) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }
  }

  async list(_request: Request, response: Response) {
    const posts = await listPostsService.execute();
    return response.status(200).json(posts);
  } 
}

export const postController = new PostController();