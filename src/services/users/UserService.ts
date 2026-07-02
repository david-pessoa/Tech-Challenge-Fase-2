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

    if (dados.roleId) {
      roleBuscada = await roleRepository.findOne({
        where: { id: dados.roleId },
      });

      if (!roleBuscada) {
        throw new AppError(400, 'Role não encontrada');
      }
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
}

export const userService = new UserService();