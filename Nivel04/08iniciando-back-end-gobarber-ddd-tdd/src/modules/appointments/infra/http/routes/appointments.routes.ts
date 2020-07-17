import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController(); // habilita os métodos

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

appointmentsRouter.post('/', appointmentController.create);
export default appointmentsRouter;
