import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import { LoginDTO } from '../../dto/LoginDTO';
import { AppError } from '../../middlewares/errorHandler';
import { userRepository } from '../../repositories/UserRepository';

export class AuthService {
  async login(dados: LoginDTO) {
    // Busca o usuário pela matrícula, carregando também a role
    const usuario = await userRepository.findOne({
      where: { matricula: dados.matricula },
      relations: ['role'],
    });

    // Se não encontrou, retorna erro genérico (não revelamos se é matrícula ou senha)
    if (!usuario) {
      throw new AppError(401, 'Matrícula ou senha inválidas');
    }

    // Compara a senha informada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaCorreta) {
      throw new AppError(401, 'Matrícula ou senha inválidas');
    }

    // Gera o token JWT com os dados básicos do usuário
    const token = jwt.sign(
      {
        sub: usuario.id,
        role: usuario.role.nome,
      },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn as any }
    );

    // Retorna o token e dados básicos — sem a senha
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula,
        role: usuario.role.nome,
      },
    };
  }
}

export const authService = new AuthService();
