import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';

// recebe o user_id
interface IRequest {
    user_id: string;
}
@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    // recebe user_id e retorna a lista de usuários
    public async execute({ user_id }: IRequest): Promise<User[]> {
        // vai tentar encontrar users no cache e retorna uma lista de User
        let users = await this.cacheProvider.recover<User[]>(
            `providers-list:${user_id}`,
        );

        // let users=null;

        if (!users) {
            // busca,listo todos providers com excessão desse user id ali (atual do proprio user)
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id,
            });
            console.log('Chegou');
            // salva informações da listagem de providers no cache sem o user logado e salva users
            await this.cacheProvider.save(
                `providers-list:${user_id}`,
                classToClass(users),
            );
        }
        return users;
    }
}
export default ListProvidersService;
