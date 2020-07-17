import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        // criar regra de negócio no 'service'.

        // instancia CreateUserService trazendo os dados do service pa cá
        const createUser = container.resolve(CreateUserService);

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
