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

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.id);
      const usuario = await userService.update(id, request.body);

      response.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.id);
      const result = await userService.delete(id);

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getMe(request: Request, response: Response, next: NextFunction) {
    try {
      const usuarioLogado = request.user;
      delete usuarioLogado.senha;
      usuarioLogado.role = usuarioLogado.role.nome;

      response.status(200).json(usuarioLogado);
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
