import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

// O método de execute vai lidar com retorno do user do CreateUserService
// através do Promise<User>
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}
// pois vou retornar mais de uma informação, então
// retorna um objeto e dentro dele vai ter um user do tipo User na Promise
@injectable()
class AuthenticateUserService {
    // vou receber um repositório como parametro 'usersRepository'
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // user.password - Senha criptografada
        // password - Senha não criptografada
        // compara-las com bcrypt
        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        // informações q eu posso colocar do user para usar dps "permissões/nome"
        // const token = sign({Armazena de modo não seguro'permissão'}, ' chave secreta strig md5 ' ,{configurações do token});
        const token = sign({}, secret, {
            subject: user.id, // id do user q gerou este token
            expiresIn,
        });
        // Se chegou até aqui o usuário é autenticado.
        return {
            user,
            token,
        };
    }
}
export default AuthenticateUserService;
