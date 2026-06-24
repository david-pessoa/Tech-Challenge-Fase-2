import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/Role";

// Repositório responsável por acessar a tabela de roles no banco
export const roleRepository = AppDataSource.getRepository(Role);