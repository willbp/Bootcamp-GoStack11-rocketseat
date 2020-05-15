import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController(); // habilita os métodos
const providerAppointmentsController = new ProviderAppointmentsController(); // habilita os métodos

// como todas rotas de agendamento precisam de auth das rotas
// ele vai aplicar o middleware em todas rotas de agendamento
appointmentsRouter.use(ensureAuthenticated);

// listar todos agendamentos da nossa aplicação
// appointmentsRouter.get('/', async (request, response) => {
// acessa classe AppointmentsRepository, acessa classe all
// e retorna para appointments (array) o resultado
//  const appointments = await appointmentsRepository.find();
//  return response.json(appointments);
// });

// POST: EXEMPLO
// USE: toda rota que inicie com /appointments independente se for get,put..
// ele repassa oq tem depois do / 'no caso appointments para dentro de appointmentsRouter

// celebrate ({ validações })
// Segments=constantes | validar body(post), queryparams,header,routeparams
// Rota para criação de um appointment (agendamento)
appointmentsRouter.post(
    '/',
    celebrate({
        // verifica os 2 campos do corpo, colchete pq são variaveis
        [Segments.BODY]: {
            // Joi traz as verificações
            provider_id: Joi.string().uuid().required(),
            date: Joi.date(),
        },
    }),
    appointmentController.create,
);
// rota ficou aqui porque o prestador deve estar logado para fazer sua listagem.
appointmentsRouter.get('/me', providerAppointmentsController.index);
export default appointmentsRouter;
