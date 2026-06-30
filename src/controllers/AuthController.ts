import { NextFunction, Request, Response } from 'express';

import { authService } from '../services/auth/AuthService';

export class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      // Pega matrícula e senha do corpo da requisição e passa pro service
      const resultado = await authService.login(request.body);

      // Retorna o token e dados do usuário
      response.json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
