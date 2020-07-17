import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    // index pois é a listagem
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // precisamos do usuário logado
        // só porque vamos pegar o provider_id através da rota, ele ficou aqui
        // se não ia junto embaixo
        const { provider_id } = request.params;
        const { day, month, year } = request.query;

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const listProviderDayAvailability = container.resolve(
            ListProviderDayAvailabilityService,
        );

        // cria agendamento, com os dados... e salva em appointment
        const availability = await listProviderDayAvailability.execute({
            provider_id,
            day: Number(day), // request.query vem em string então devemos alterar para number
            month: Number(month),
            year: Number(year),
        });
        return response.json(availability);
    }
}
