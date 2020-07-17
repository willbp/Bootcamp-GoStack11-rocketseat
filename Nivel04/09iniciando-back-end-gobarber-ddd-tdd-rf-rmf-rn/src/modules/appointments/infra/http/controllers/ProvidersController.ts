import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
    // index pois é a listagem
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // precisamos do usuário logado
        const user_id = request.user.id;

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const listProviders = container.resolve(ListProvidersService);

        // cria agendamento, com os dados... e salva em appointment
        const providers = await listProviders.execute({
            user_id,
        });
        return response.json(providers);
    }
}
