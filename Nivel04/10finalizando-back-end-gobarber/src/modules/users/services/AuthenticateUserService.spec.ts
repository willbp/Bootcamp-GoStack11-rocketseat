import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
// import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
// let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

// por ser autenticação e lidar com hash momentaneamente vamos se conectar a 2 services
describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        /* createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        ); */
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it('should be able authenticate', async () => {
        // crio usuário
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // agora posso autenticar com este usuário aqui
        const response = await authenticateUser.execute({
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero que na minha resposta tenha uma propriedade chamada token
        expect(response).toHaveProperty('token');
        // espero se retorna informação chamada user 'q é o usuário criado aqui'
        expect(response.user).toEqual(user);
        // isso porque dentro do AuthenticateUserService ele retorna user e token
    });

    // não autentica com user q n existe
    it('should not be able authenticate with non existing user', async () => {
        // se isto é rejeitado e que o erro retornado seja uma instancia
        // de AppError
        await expect(
            authenticateUser.execute({
                email: 'willa@gosta.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // logar com usuário porém com a senha errada
    it('should not be able to authenticate with wrong password', async () => {
        // crio usuário
        await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // espero que na minha resposta tenha uma propriedade chamada token
        await expect(
            authenticateUser.execute({
                email: 'willa@gosta.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
