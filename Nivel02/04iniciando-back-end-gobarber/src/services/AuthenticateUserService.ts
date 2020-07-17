import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

// O método de execute vai lidar com retorno do user do CreateUserService
// através do Promise<User>
import User from '../models/User';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}
// pois vou retornar mais de uma informação, então
// retorna um objeto e dentro dele vai ter um user do tipo User na Promise

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        // Validar se o e-mail q ele digitou é um e-mail de usuário válido
        const usersRepository = getRepository(User); // libera CRUD

        const user = await usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // user.password - Senha criptografada
        // password - Senha não criptografada
        // compara-las com bcrypt
        const passwordMatched = await compare(password, user.password);

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
