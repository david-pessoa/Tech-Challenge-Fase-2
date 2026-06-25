import { Request, Response } from "express";
import { createPostService } from "../services/post/CreatePostService";

export class PostController {
  async create(request: Request, response: Response) {
    const newPost = await createPostService.execute(request.body);

    return response.status(201).json(newPost);
  }
}

export const postController = new PostController();