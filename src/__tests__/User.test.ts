import { User } from '../entities/User';

// Teste unitário da Entity User
describe('User Entity', () => {
  it('Deve criar um usuário corretamente', () => {
    const user = new User();

    user.nome = 'David';
    user.matricula = '99986';

    expect(user.nome).toBe('David');
    expect(user.matricula).toBe('99986');
  });
});
