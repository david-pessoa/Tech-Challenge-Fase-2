import { NextFunction, Request, Response } from 'express';

// Classe para erros conhecidos da aplicação com código HTTP
export class AppError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

// Middleware central de tratamento de erros — captura todos os erros da aplicação
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  // Se for um erro conhecido (AppError), retorna o status e mensagem corretos
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Se for um erro inesperado, retorna 500
  console.error('Erro inesperado:', error);
  return response.status(500).json({
    message: 'Erro interno do servidor',
  });
}
