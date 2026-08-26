import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/users/UserService';

export class UserController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const usuarios = await userService.list(request.user);

      return response.status(200).json(usuarios);
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const usuarioLogado = request.user;
      const usuario = await userService.create(
        {
          ...request.body,
          image: request.file?.buffer ?? null,
        },
        usuarioLogado
      );

      response.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.id);
      const usuarioLogado = request.user;
      const usuario = await userService.update(id, {
        ...request.body,
        image: request.file?.buffer,
      }, usuarioLogado);

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
      usuarioLogado.image = `/api/user/${usuarioLogado.id}/image`;

      response.status(200).json(usuarioLogado);
    } catch (error) {
      return next(error);
    }
  }

  async getUserImage(request: Request, response: Response, next: NextFunction) {
    try {
      const id = String(request.params.id);
      const userImage = await userService.getImage(id);

      if (!userImage) {
        return response.status(404).json({
          message: 'Imagem não encontrada',
        });
      }

      const { fileTypeFromBuffer } = await import('file-type');
      const tipo = await fileTypeFromBuffer(userImage);

      if (!tipo) {
        return response.status(415).json({
          message: 'Tipo de imagem não identificado',
        });
      }

      response.type(tipo.mime);
      return response.send(userImage);
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
