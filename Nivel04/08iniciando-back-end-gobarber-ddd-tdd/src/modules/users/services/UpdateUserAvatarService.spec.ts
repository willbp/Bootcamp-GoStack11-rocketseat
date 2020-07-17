import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to create a new avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        // criar um usuário
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg', // qualquer coisa
        });
        // espero que o user.avatar seja avatar.jpg
        expect(user.avatar).toBe('avatar.jpg');
    });
    // se o usuário não existe (user_id)
    it('should NOT be able to update a avatar to a non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // Deve deletar um avatar antigo quando estiver dando update num novo
    it('should be able to delete and old avatar when updating to a new avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        // nome da clase fakeStorageProvider e o método que quero espionar deleteFile
        // retorna a função deleteFile no const

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        // espero que essa função tenha sido chamada com um param antigo - avatar
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        // e espero que o avatar novo do usuário seja avatar2.jpg
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
