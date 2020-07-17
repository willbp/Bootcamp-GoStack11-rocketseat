import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    // recebe o id do user q quer att o avatar e o nome do avatar
    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        // preciso att um usuário, então preciso acessar o usuário do typeorm
        // e o model de user para pegar a estrutura dos dados de Users
        const usersRepository = getRepository(User); // libera métodos create/update

        // verifica se as variáveis q ele recebe são validas *user_id e avatarFilename)
        const user = await usersRepository.findOne(user_id); // procura um usuário

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar.',
                401,
            );
        }
        if (user.avatar) {
            // deletar avatar anterior
            // buscar arquivo de avatar do user
            // join une 2 caminhos
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            // assim ele acessa uploadConfig e pega directory
            // outro pega user.avatar q é oq queremos remover
            // (armazenado na tabela do user)

            // checar se o arquivo existe
            // garante q está utilizando funções do fs em formato de promises(habilita await)
            // stat (traz status do arquivo, somente se ele existir)
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            // se o arquivo existe existe ele vai deletar ele
            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }
        // atualizar usuário (user já está intanciado) se n tivesse era userRepository.update...
        user.avatar = avatarFilename;
        await usersRepository.save(user); // save cria/atualiza informações

        return user;
    }
}

export default UpdateUserAvatarService;
