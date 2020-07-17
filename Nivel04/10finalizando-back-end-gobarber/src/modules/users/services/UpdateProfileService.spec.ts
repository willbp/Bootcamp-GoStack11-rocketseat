import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    // eslint-disable-next-line no-irregular-whitespace
    // Usuário deve poder atualizar seu perfil (nome, email e senha).
    it('should be able to update the profile', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero q ele seja atualizado (nome e email) e retorna o user atualizado
        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Willa Gostinho',
            email: 'willagostinho@mail.com',
        });
        // espero/verifico se realmente foi atualizado
        expect(updatedUser.name).toBe('Willa Gostinho');
        expect(updatedUser.email).toBe('willagostinho@mail.com');
    });

    // não deve poder atualizar o perfil do usuário inexistente
    it('should not be able update the profile from non-existing user', async () => {
        // espero que não liste um usuário q n existe
        expect(
            updateProfile.execute({
                user_id: 'non-existing-user-id',
                name: 'Willa Gosta',
                email: 'willa@gosta.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // eslint-disable-next-line no-irregular-whitespace
    // O usuário não pode alterar seu e-mail para um e-mail já utilizado por outro usuário;
    it('should not be able to change to another user e-mail', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // crio usuário q vai receber atualização
        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@mail.com',
            password: '123456',
        });

        // atualiza user tentando por email 'willa@gosta.com',
        // espero que a execução deste service rejeite e me de um erro
        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Test',
                email: 'willa@gosta.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // eslint-disable-next-line no-irregular-whitespace
    // - abaixo deste teste Para atualizar sua senha, o usuário deve informar a senha antiga;
    // o usuário deve poder alterar sua senha
    it('should be able to update the password', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero q ele seja atualizado (nome e email e senha) e retorna o user atualizado
        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Willa Gostinho',
            email: 'willagostinho@mail.com',
            // faço teste pensando nas coisas darem certo.
            old_password: '123456',
            password: 'senhanova',
        });
        // espero/verifico se realmente foi atualizado
        expect(updatedUser.password).toBe('senhanova');
    });

    // eslint-disable-next-line no-irregular-whitespace
    // - Para atualizar sua senha, o usuário deve informar a senha antiga;
    // tentamos então não informar a senha antiga para dar erro
    it('should not be able to update the password without old password', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero que essa requisição ao service rejeite e que de AppError
        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Willa Gostinho',
                email: 'willagostinho@mail.com',
                // sem old password
                password: 'senhanova',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // Não deve poder atualizar a senha com senha antiga incorreta
    // tentamos então informar a senha antiga errada para dar erro
    it('should not be able to update the password with wrong old password', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero que essa requisição ao service rejeite e que de AppError
        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Willa Gostinho',
                email: 'willagostinho@mail.com',
                old_password: 'senhaerrada',
                password: 'senhanova',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
