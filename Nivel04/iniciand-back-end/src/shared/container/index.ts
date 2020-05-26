import { container } from 'tsyringe';
// cadastra providers q eu acabei de criar dentro de index.ts (provider)
import './providers';
import '@modules/users/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

// <IAppointmentsRepository>tipagem para que a saida tenha exatamente o formato
// de IAppointmentsRepository se não ele bloqueia
// registerSingleton recebe 2 parametros
// 1-qual q vai ser o 'uuid'- nome q vou dar pra solicitar um repositório de appointments
// 2-retorna AppointmentsRepository

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository', // pudia ser batata
    AppointmentsRepository,
);
// container consegui fazer inject injectable
// registerSingleton quando chamar UsersRepository(amarelo)
// ele instancia a classe UserRepository, obrigando-a a ser do tipo IUserRepository
container.registerSingleton<IUsersRepository>(
    'UsersRepository', // pudia ser batata
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository', // pudia ser batata
    UserTokensRepository,
);

// registerSingleton quando chamar NotificationsRepository(amarelo)
// ele instancia a classe NotificationsRepository, obrigando-a a ser do tipo INotificationsRepository
container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository', // pudia ser batata
    NotificationsRepository,
);
