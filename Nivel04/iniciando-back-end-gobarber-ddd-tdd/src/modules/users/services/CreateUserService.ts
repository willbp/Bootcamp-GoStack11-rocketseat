import { injectable, inject } from 'tsyringe';
// O método de execute vai lidar com retorno do user do CreateUserService
// através do Promise<User>
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
}
@injectable()
class CreateUserService {
    // vou receber um repositório como parametro 'usersRepository'
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        // vou ter meu hashProvider do formato IHashProvider
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        // receber nome, email e password, para isto crio uma interface
        // habilitando CRUD

        // tratando usuário duplicado
        // verifica se o email é o mesmo do recebido no execute
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email adress already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        // cria a instância da classe de User
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        // retorna usuário criado
        return user;
    }
}
export default CreateUserService;
