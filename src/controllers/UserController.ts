import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/users/UserService';

export class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const usuarioLogado = request.user;
      const usuario = await userService.create(request.body, usuarioLogado);

      response.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();