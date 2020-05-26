import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageprovider: IStorageProvider,
    ) {}

    // recebe o id do user q quer att o avatar e o nome do avatar
    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        // preciso att um usuário, então preciso acessar o usuário do typeorm
        // e o model de user para pegar a estrutura dos dados de Users

        // verifica se as variáveis q ele recebe são validas *user_id e avatarFilename)
        const user = await this.usersRepository.findById(user_id); // procura um usuário

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar.',
                401,
            );
        }
        // se o avatar já existia
        if (user.avatar) {
            // deleta o avatar anterior antes de salvar o novo
            await this.storageprovider.deleteFile(user.avatar);
        }
        // salvando novo avatar
        const filename = await this.storageprovider.saveFile(avatarFilename);
        // preenche o nome do avatar
        user.avatar = filename;

        await this.usersRepository.save(user); // save cria/atualiza informações
        return user;
    }
}
export default UpdateUserAvatarService;
