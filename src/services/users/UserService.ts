import bcrypt from "bcryptjs";

import { AppDataSource } from "../../config/data-source";
import { Role } from "../../entities/Role";
import { User } from "../../entities/User";
import { AppError } from "../../middlewares/errorHandler";
import { CreateUserDTO } from "../../dto/CreateUserDTO";
import { userRepository } from "../../repositories/UserRepository";
import { roleRepository } from "../../repositories/RoleRepository";

export class UserService {
    async create(dados: CreateUserDTO) {
        // Verifica se já existe um usuário com essa matrícula
        const usuarioExistente = await userRepository.findOne({
            where: { matricula: dados.matricula },
        });

        if (usuarioExistente) {
            throw new AppError(400, "Matrícula já cadastrada");
        }

        // Busca a role informada ou usa ALUNO como padrão
        let role: Role;

        if (dados.roleId) {
            const roleBuscada = await roleRepository.findOne({
                where: { id: dados.roleId },
            });

            if (!roleBuscada) {
                throw new AppError(400, "Role não encontrada");
            }

            role = roleBuscada;
        } else {
            const roleAluno = await roleRepository.findOne({
                where: { nome: "ALUNO" },
            });

            if (!roleAluno) {
                throw new AppError(500, "Role padrão ALUNO não encontrada");
            }

            role = roleAluno;
        }

        // Criptografa a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

        // Cria e salva o usuário
        const usuario = userRepository.create({
            matricula: dados.matricula,
            nome: dados.nome,
            senha: senhaCriptografada,
            role,
        });

        await userRepository.save(usuario);

        // Retorna os dados sem expor a senha
        const { senha: _, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }
}

export const userService = new UserService();