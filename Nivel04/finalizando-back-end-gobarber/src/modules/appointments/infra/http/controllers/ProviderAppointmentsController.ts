import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
    // método index para listar todos prestadores
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // recupero o usuário logaod
        const provider_id = request.user.id;

        // pega de dentro do request.body os dados que o user vai utilizar
        // para criar um novo agendamento
        const { day, month, year } = request.body;

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const listProviderAppointments = container.resolve(
            ListProviderAppointmentsService,
        );

        // cria agendamento, com os dados... e salva em appointment
        const appointments = await listProviderAppointments.execute({
            provider_id,
            day,
            month,
            year,
        });
        return response.json(appointments);
    }
}
