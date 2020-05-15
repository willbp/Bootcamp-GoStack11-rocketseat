import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    // index pois é a listagem
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // precisamos do usuário logado
        // só porque vamos pegar o provider_id através da rota, ele ficou aqui
        // se não ia junto embaixo
        const { provider_id } = request.params;
        const { month, year } = request.body;

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const listProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        // cria agendamento, com os dados... e salva em appointment
        const availability = await listProviderMonthAvailability.execute({
            provider_id,
            month,
            year,
        });
        return response.json(availability);
    }
}
