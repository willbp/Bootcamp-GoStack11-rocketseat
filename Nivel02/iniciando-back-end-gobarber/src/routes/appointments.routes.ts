import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

// como todas rotas de agendamento precisam de auth das rotas
// ele vai aplicar o middleware em todas rotas de agendamento
appointmentsRouter.use(ensureAuthenticated);

// listar todos agendamentos da nossa aplicação
appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    // acessa classe AppointmentsRepository, acessa classe all
    // e retorna para appointments (array) o resultado
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

// POST: EXEMPLO
// USE: toda rota que inicie com /appointments independente se for get,put..
// ele repassa oq tem depois do / 'no caso appointments para dentro de appointmentsRouter
appointmentsRouter.post('/', async (request, response) => {
    // pega de dentro do request.body os dados que o user vai utilizar
    // para criar um novo agendamento
    const { provider_id, date } = request.body;

    // parseISO transformando dado (pega string e transforma em date)
    const parsedDate = parseISO(date);

    const CreateAppointment = new CreateAppointmentService();

    // cria agendamento, com os dados... e salva em appointment
    const appointment = await CreateAppointment.execute({
        date: parsedDate,
        provider_id,
    });
    return response.json(appointment);
    // para dar retorno do erro do service precisa de try catch
});
export default appointmentsRouter;
