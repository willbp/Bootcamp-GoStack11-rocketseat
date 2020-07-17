import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response> {
        // para autenticação precisamos de email e senha
        const { email, password } = request.body;

        // como vou ter regra de negócio vou criar um service
        // verifica email e faz hash do pass, gerar token JWT..
        // criar dentro de services o arquivo AuthenticateUserServices.ts

        // instnacia o service para var authenticateUser
        const authenticateUser = container.resolve(AuthenticateUserService);

        // pega/recebe/busca resultado do Service
        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        // não retorna ao user a senha
        delete user.password;

        return response.json({ user, token });
    }
}
