import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

// recebe o user_id
interface IRequest {
    user_id: string;
}
@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    // recebe o id do user q quer att o avatar e o nome do avatar
    public async execute({ user_id }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        // se n existir usuário
        if (!user) {
            throw new AppError('User not found');
        }

        return user;
    }
}
export default ShowProfileService;
