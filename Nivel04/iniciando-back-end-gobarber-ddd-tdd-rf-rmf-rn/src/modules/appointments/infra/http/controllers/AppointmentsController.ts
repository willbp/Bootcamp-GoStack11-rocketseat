import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
    // método create recebe request e response do express e retorna uma Promise'Response'
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // recupero o usuário logaod
        const user_id = request.user.id;

        // pega de dentro do request.body os dados que o user vai utilizar
        // para criar um novo agendamento
        const { provider_id, date } = request.body;

        // parseISO transformando dado (pega string e transforma em date)
        const parsedDate = parseISO(date);

        // sempre que eu precisar utilizar o service usa-se container.resolve+nome do service
        const CreateAppointment = container.resolve(CreateAppointmentService);

        // cria agendamento, com os dados... e salva em appointment
        const appointment = await CreateAppointment.execute({
            date: parsedDate,
            provider_id,
            user_id,
        });
        return response.json(appointment);
    }
}
