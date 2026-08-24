import bcrypt from 'bcryptjs';

import { AppDataSource } from '../../config/data-source';
import { Role } from '../../entities/Role';
import { User } from '../../entities/User';
import { AppError } from '../../middlewares/errorHandler';
import { CreateUserDTO } from '../../dto/CreateUserDTO';
import { userRepository } from '../../repositories/UserRepository';
import { roleRepository } from '../../repositories/RoleRepository';

export class UserService {
  async create(dados: CreateUserDTO, usuarioLogado: User) {
    const usuarioExistente = await userRepository.findOne({
      where: { matricula: dados.matricula },
    });

    if (usuarioExistente) {
      throw new AppError(400, 'Matrícula já cadastrada');
    }

    let roleBuscada: Role | null = null;

    // Extraí role passada no corpo da requisição
    if (dados.role) {
      roleBuscada = await roleRepository.findOne({
        where: { nome: dados.role.toUpperCase() },
      });

      if (!roleBuscada) {
        throw new AppError(404, 'Role não encontrada');
      }

      // Na ausência de role no corpo da requsição, atribui role de aluno
    } else {
      roleBuscada = await roleRepository.findOne({
        where: { nome: 'ALUNO' },
      });

      if (!roleBuscada) {
        throw new AppError(500, 'Role padrão ALUNO não encontrada');
      }
    }

    const cargoDoDonoDoToken = usuarioLogado.role.nome;
    const cargoDoNovoUsuario = roleBuscada.nome;

    if (cargoDoDonoDoToken === 'PROFESSOR' && cargoDoNovoUsuario !== 'ALUNO') {
      throw new AppError(403, 'Professores só possuem permissão para cadastrar alunos.');
    }

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

    const usuario = userRepository.create({
      matricula: dados.matricula,
      nome: dados.nome,
      senha: senhaCriptografada,
      role: roleBuscada,
    });

    await userRepository.save(usuario);

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async delete(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new AppError(400, 'ID de usuário inválido');
    }

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    await userRepository.remove(user);

    return {
      message: 'Usuário deletado com sucesso',
    };
  }
}

export const userService = new UserService();
