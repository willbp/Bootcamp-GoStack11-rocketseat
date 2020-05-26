import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

// cria variável como global do tipo 'tal'
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

// foi no service e mandou email somente, o restante das regras de negócios quem define
// é os outros testes da app. exemplo 'mandar e-mail pra um cara q nem existe'
// neste teste ele só está verificando se o e-mail foi enviado
describe('ResetPasswordService', () => {
    // preenche informações do let
    // antes de cada um dos testes eu quero preencher as informações com novas infos.
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        fakeUserTokensRepository = new FakeUserTokensRepository();

        fakeHashProvider = new FakeHashProvider();

        // o que acontece quando o código é disparado
        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    // deve ser capaz de resetar a senha
    it('should be able to reset the password', async () => {
        // crio um usuário
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // cria o token para o usuário acima
        const { token } = await fakeUserTokensRepository.generate(user.id);

        // // identifica se a função generateHash foi chamada.
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        // quando chamado ele recebe só o e-mail
        // faz a troca de senha
        await resetPassword.execute({
            password: '123123',
            token,
        });

        // buscar usuário novamente
        const updatedUser = await fakeUsersRepository.findById(user.id);

        // espero que a função tenha sido chamada com o parametro 123123 'nova senha digitada'
        expect(generateHash).toHaveBeenCalledWith('123123');
        // espero que o user.password seja '123123'
        // ?. porque pode ser nulo
        expect(updatedUser?.password).toBe('123123');
    });

    // verifica para não permitir resetar o password com token q não existe
    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // verifica para não permitir resetar o password com user q não existe
    // criando token para um usuário inexistente.
    it('should not be able to reset the password with non-existing user', async () => {
        // gero um token para um user.id q no caso é 'non-existing-user'
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );

        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // não permitir que reset aconteça 2 horas dps do token ter sido gerado
    it('should not be able to reset password if passed more then 2 hours', async () => {
        // crio um usuário
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // gera o token para o usuário acima
        const { token } = await fakeUserTokensRepository.generate(user.id);

        // simular 2 horas no futuro| Qdo meu código chamar a função Date.now, ao invés
        // de chamar a função original, ele chamará a do mockImplementationOnce once=1x
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        // esperar q o resetPassword rejeite e q o erro seja uma instancia de AppError
        // simular que o reset da senha está sendo feito 2horas após gerar o token
        await expect(
            resetPassword.execute({
                password: '123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
