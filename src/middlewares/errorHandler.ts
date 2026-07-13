import { NextFunction, Request, Response } from 'express';

export class AppError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error('Erro inesperado:', error);
  return response.status(500).json({
    message: 'Erro interno do servidor',
  });
}
