import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
    // método index para listar todos prestadores
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // recupero o usuário logaod
        const provider_id = request.user.id;

        // pega de dentro os dados através do URL que o user vai utilizar
        // para criar um novo agendamento
        const { day, month, year } = request.query;

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const listProviderAppointments = container.resolve(
            ListProviderAppointmentsService,
        );

        // cria agendamento, com os dados... e salva em appointment
        const appointments = await listProviderAppointments.execute({
            provider_id,
            day: Number(day), // request.query vem em string então devemos alterar para number
            month: Number(month),
            year: Number(year),
        });
        return response.json(classToClass(appointments));
    }
}
