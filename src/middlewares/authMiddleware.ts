import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from './errorHandler';
import { userRepository } from '../repositories/UserRepository';

// Extende o tipo Request do Express para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Verifica se o token JWT é válido e injeta o usuário na requisição
export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;

    // Verifica se o header Authorization foi enviado
    if (!authHeader) {
      throw new AppError(401, 'Token não informado');
    }

    // Verifica se o formato é "Bearer TOKEN"
    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new AppError(401, 'Formato de token inválido');
    }

    // Verifica se o token é válido e decodifica
    const payload = jwt.verify(token, env.jwt.secret) as { sub: string };

    // Busca o usuário no banco pelo ID do token
    const usuario = await userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!usuario) {
      throw new AppError(401, 'Usuário não encontrado');
    }

    // Injeta o usuário na requisição para uso nos controllers
    request.user = usuario;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, 'Token inválido ou expirado'));
  }
}

// Verifica se o usuário tem a role necessária para acessar a rota
export function authorizeRoles(...roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new AppError(401, 'Usuário não autenticado'));
    }

    // Verifica se a role do usuário está na lista de roles permitidas
    if (!roles.includes(request.user.role.nome)) {
      return next(new AppError(403, 'Acesso não autorizado'));
    }

    next();
  };
}
