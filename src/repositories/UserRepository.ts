import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

// Repositório responsável por acessar a tabela de usuários no banco
export const userRepository = AppDataSource.getRepository(User);
