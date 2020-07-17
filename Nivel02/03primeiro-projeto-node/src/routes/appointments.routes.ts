import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

// instanciando classe criada dentro de AppointmentsRepository.ts
// agora utilizando ppointmentsRepository. posso utilizar create, ou oq tiver dentro da outra classe
const appointmentsRepository = new AppointmentsRepository();

// listar todos agendamentos da nossa aplicação
appointmentsRouter.get('/', (request, response) => {
    // acessa classe AppointmentsRepository, acessa classe all
    // e retorna para appointments (array) o resultado
    const appointments = appointmentsRepository.all();
    return response.json(appointments);
});

// POST: EXEMPLO
// USE: toda rota que inicie com /appointments independente se for get,put..
// ele repassa oq tem depois do / 'no caso appointments para dentro de appointmentsRouter
appointmentsRouter.post('/', (request, response) => {
    try {
        // pega de dentro do request.body os dados que o user vai utilizar
        // para criar um novo agendamento
        const { provider, date } = request.body;

        // parseISO transformando dado (pega string e transforma em date)
        const parsedDate = parseISO(date);

        const CreateAppointment = new CreateAppointmentService(
            appointmentsRepository, // laranja da outra classe
        );

        // cria agendamento, com os dados... e salva em appointment
        const appointment = CreateAppointment.execute({
            date: parsedDate,
            provider,
        });
        return response.json(appointment);
        // para dar retorno do erro do service precisa de try catch
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});
export default appointmentsRouter;
