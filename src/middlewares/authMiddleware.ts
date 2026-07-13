import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from './errorHandler';
import { userRepository } from '../repositories/UserRepository';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'Token não informado');
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new AppError(401, 'Formato de token inválido');
    }

    const payload = jwt.verify(token, env.jwt.secret) as { sub: string };

    const usuario = await userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!usuario) {
      throw new AppError(401, 'Usuário não encontrado');
    }

    request.user = usuario;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, 'Token inválido ou expirado'));
  }
}

export function authorizeRoles(...roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new AppError(401, 'Usuário não autenticado'));
    }

    if (!roles.includes(request.user.role.nome)) {
      return next(new AppError(403, 'Acesso não autorizado'));
    }

    next();
  };
}
