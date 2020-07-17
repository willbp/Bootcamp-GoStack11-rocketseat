import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        // já tenho os dados aqui dentro por causa do request.body
        const { name, email, password } = request.body;

        // criar regra de negócio no 'service'.

        // cria uma instancia de CreateUserService a partir do container
        // container q seria o nosso index->createuser->e executa a unica função execute
        // após instanciar primeira coisa q roda é o constructor do CreateUserService
        const createUser = container.resolve(CreateUserService);

        // executa função execute CreateUserService
        // alimentando os dados abaixo
        const user = await createUser.execute({
            name,
            email,
            password,
        });
        // password não é retornado na tela, mas está no BD
        delete user.password;

        return response.json(user);
    }
}
