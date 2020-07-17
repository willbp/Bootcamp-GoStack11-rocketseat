import { Router } from 'express';
// router módulo de rotas do express

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

// USE: toda rota que inicie com /appointments independente se for get,put..
// ele repassa oq tem depois do / 'no caso appointments para dentro de appointmentsRouter
routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

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
