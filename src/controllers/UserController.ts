import { NextFunction, Request, Response } from 'express';

import { userService } from '../services/users/UserService';

export class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Pega os dados do corpo da requisição e passa pro service
      const usuario = await userService.create(request.body);

      // Retorna 201 (criado com sucesso) com os dados do usuário
      response.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
