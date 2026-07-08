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
  const roleAdmin = { id: 'bd1de63c-5df5-4dfd-9736-ace2d7f092b1', nome: 'ADMIN' } as Role;
  const roleProfessor = { id: '5a0e25a2-afa5-44e1-b519-4d1e2139725a', nome: 'PROFESSOR' } as Role;
  const roleAluno = { id: 'ffc3d557-17c0-474e-a2f5-5fa816f2d854', nome: 'ALUNO' } as Role;

  const adminLogado = { id: '16dd67fd-afec-4080-a36f-0c8605d9c662', role: roleAdmin } as User;
  const professorLogado = { id: 'cea50a97-f63e-4cd6-8a2c-e2a02f93c6e4', role: roleProfessor } as User;

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
      { matricula: '345678', nome: 'Novo Prof', senha: 'Prof345', roleId: '5a0e25a2-afa5-44e1-b519-4d1e2139725a' },
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
      { matricula: '874569', nome: 'Novo Aluno', senha: 'Aluni936', roleId: '	ffc3d557-17c0-474e-a2f5-5fa816f2d854' },
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
        { matricula: '754914', nome: 'Admin Invasor', senha: 'Admin853', roleId: 'bd1de63c-5df5-4dfd-9736-ace2d7f092b1' },
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
        { matricula: '564959', nome: 'Prof Falso', senha: 'Prof457', roleId: '5a0e25a2-afa5-44e1-b519-4d1e2139725a' },
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
        { matricula: '000', nome: 'Clone', senha: 'Clone754', roleId: '	ffc3d557-17c0-474e-a2f5-5fa816f2d854' },
        adminLogado
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Matrícula já cadastrada',
    });
  });
});