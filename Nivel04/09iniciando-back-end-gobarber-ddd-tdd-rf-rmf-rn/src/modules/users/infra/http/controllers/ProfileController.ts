import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
    // rota para mostrar perfil do usuário (trazendo os dados para ele qdo for atualiza)
    public async show(request: Request, response: Response): Promise<Response> {
        // exibição do perfil
        const user_id = request.user.id; // pega id do user logado por token

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ user_id });
        // temos rota para exibir perfil

        delete user.password;

        return response.json(user);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id; // pega id do user logado por token
        // já tenho os dados aqui dentro por causa do request.body
        const { name, email, old_password, password } = request.body;

        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });
        // password não é retornado na tela, mas está no BD
        delete user.password;

        return response.json(user);
    }
}
