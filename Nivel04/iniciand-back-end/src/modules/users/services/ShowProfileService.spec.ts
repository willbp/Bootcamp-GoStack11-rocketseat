import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    // seja possivel mostrar o profile
    it('should be able to show the profile', async () => {
        // criar um usuário (porque ele deve existir para fazer isso)
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        // espero q ele seja atualizado (nome e email) e retorna o user atualizado
        const profile = await showProfile.execute({
            user_id: user.id,
        });
        // espero/verifico que listando sejam o msm nome e email
        expect(profile.name).toBe('Willa Gosta');
        expect(profile.email).toBe('willa@gosta.com');
    });

    // caso tente mostrar perfil de usuário inexistente de erro
    it('should be able to show the profile', async () => {
        // espero que não liste um usuário q n existe
        expect(
            showProfile.execute({
                user_id: 'non-existing-user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
