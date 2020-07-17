import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    // para autenticação precisamos de email e senha
    const { email, password } = request.body;

    // como vou ter regra de negócio vou criar um service
    // verifica email e faz hash do pass, gerar token JWT..
    // criar dentro de services o arquivo AuthenticateUserServices.ts

    // instnacia o service para var authenticateUser
    const authenticateUser = new AuthenticateUserService();

    // pega/recebe/busca resultado do Service
    const { user, token } = await authenticateUser.execute({
        email,
        password,
    });

    // não retorna ao user a senha
    delete user.password;

    return response.json({ user, token });
});
export default sessionsRouter;
