import { userService } from '../services/users/UserService';
import { userRepository } from '../repositories/UserRepository';
import { roleRepository } from '../repositories/RoleRepository';
import { User } from '../entities/User';
import { Role } from '../entities/Role';

jest.mock('../repositories/UserRepository', () => ({
  userRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock('../repositories/RoleRepository', () => ({
  roleRepository: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('senha_criptografada_fake'),
}));

describe('UserService - Criação de Usuários', () => {
  const roleAdmin = { id: 'role-1', nome: 'ADMIN' } as Role;
  const roleProfessor = { id: 'role-2', nome: 'PROFESSOR' } as Role;
  const roleAluno = { id: 'role-3', nome: 'ALUNO' } as Role;

  const adminLogado = { id: 'user-admin', role: roleAdmin } as User;
  const professorLogado = { id: 'user-prof', role: roleProfessor } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve permitir que um ADMIN crie um PROFESSOR', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    (roleRepository.findOne as jest.Mock).mockResolvedValue(roleProfessor);

    const mockUsuarioSalvo = {
      matricula: '345678',
      nome: 'Novo Prof',
      senha: 'senha_criptografada_fake',
      role: roleProfessor,
    };

    (userRepository.create as jest.Mock).mockReturnValue(mockUsuarioSalvo);
    (userRepository.save as jest.Mock).mockResolvedValue(mockUsuarioSalvo);

    const resultado = await userService.create(
      { matricula: '345678', nome: 'Novo Prof', senha: 'Prof345', roleId: 'role-2' },
      adminLogado
    );

    expect(resultado).toHaveProperty('matricula', '345678');
    expect(resultado).not.toHaveProperty('senha');
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('Deve permitir que um PROFESSOR crie um ALUNO', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    (roleRepository.findOne as jest.Mock).mockResolvedValue(roleAluno); 

    const mockUsuarioSalvo = {
      matricula: '874569',
      nome: 'Novo Aluno',
      senha: 'senha_criptografada_fake',
      role: roleAluno,
    };

    (userRepository.create as jest.Mock).mockReturnValue(mockUsuarioSalvo);
    (userRepository.save as jest.Mock).mockResolvedValue(mockUsuarioSalvo);

    const resultado = await userService.create(
      { matricula: '874569', nome: 'Novo Aluno', senha: 'Aluni936', roleId: 'role-3' },
      professorLogado
    );

    expect(resultado.matricula).toBe('874569');
    expect(userRepository.save).toHaveBeenCalled();
  });


  it('Não deve permitir que um PROFESSOR crie um ADMIN', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    (roleRepository.findOne as jest.Mock).mockResolvedValue(roleAdmin);

    await expect(
      userService.create(
        { matricula: '754914', nome: 'Admin Invasor', senha: 'Admin853', roleId: 'role-1' },
        professorLogado 
      )
    ).rejects.toMatchObject({
      statusCode: 403,
      message: 'Professores só possuem permissão para cadastrar alunos.',
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('Não deve permitir que um PROFESSOR crie outro PROFESSOR', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    (roleRepository.findOne as jest.Mock).mockResolvedValue(roleProfessor); 

    await expect(
      userService.create(
        { matricula: '564959', nome: 'Prof Falso', senha: 'Prof457', roleId: 'role-2' },
        professorLogado 
      )
    ).rejects.toMatchObject({
      statusCode: 403,
      message: 'Professores só possuem permissão para cadastrar alunos.',
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('Não deve permitir o cadastro de uma matrícula já existente', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(new User());

    await expect(
      userService.create(
        { matricula: '000', nome: 'Clone', senha: 'Clone754', roleId: 'role-3' },
        adminLogado
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Matrícula já cadastrada',
    });
  });
});