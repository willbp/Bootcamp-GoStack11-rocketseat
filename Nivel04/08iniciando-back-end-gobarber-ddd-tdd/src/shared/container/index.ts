import { container } from 'tsyringe';
// cadastra providers q eu acabei de criar dentro de index.ts (provider)
import './providers';

import '@modules/users/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

// <IAppointmentsRepository>tipagem para que a saida tenha exatamente o formato
// de IAppointmentsRepository se não ele bloqueia
// registerSingleton recebe 2 parametros
// 1-qual q vai ser o 'uuid'- nome q vou dar pra solicitar um repositório de appointments
// 2-retorna AppointmentsRepository

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository', // pudia ser batata
    AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository', // pudia ser batata
    UsersRepository,
);
