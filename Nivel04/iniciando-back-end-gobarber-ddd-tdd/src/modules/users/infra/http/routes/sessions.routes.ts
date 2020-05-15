import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController(); // habilita métodos

sessionsRouter.post('/', sessionsController.create);
export default sessionsRouter;
