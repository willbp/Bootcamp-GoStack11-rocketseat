import { Router } from 'express';
// router módulo de rotas do express

import appointmentsRouter from './appointments.routes';

const routes = Router();

// USE: toda rota que inicie com /appointments independente se for get,put..
// ele repassa oq tem depois do / 'no caso appointments para dentro de appointmentsRouter
routes.use('/appointments', appointmentsRouter);

export default routes;
/*
// routes.get('/', (request, response) => response.json({ message: 'Testeee' }));

routes.post('/users', (request, response) => {
    const { name, email } = request.body;

    const user = {
        name,
        email,
    };
    return response.json(user);
});
*/
