import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailprovider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

// toda vez q minha app precisar de um StorageProvider
// manda utilizar DiskStorageProvider
container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTemplateProvider,
);

// obriga o constructor ser executado com o registerInstance
// e continua sendo lido como um register singleton
// container resolve que faz a injeção de dependência e verifica constructor
// se tem a injeção de dependência
container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailprovider),
);
