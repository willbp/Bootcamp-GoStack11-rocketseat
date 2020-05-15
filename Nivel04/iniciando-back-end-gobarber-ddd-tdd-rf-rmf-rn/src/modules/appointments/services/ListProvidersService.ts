import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
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
    ) {}

    // recebe user_id e retorna a lista de usuários
    public async execute({ user_id }: IRequest): Promise<User[]> {
        // listo todos providers com excessão desse user id ali (atual do proprio user)
        const users = await this.usersRepository.findAllProviders({
            except_user_id: user_id,
        });

        return users;
    }
}
export default ListProvidersService;
