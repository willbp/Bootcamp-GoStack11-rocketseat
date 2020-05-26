import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

// quando for ethereal roda o ethereal
// quando for SES roda o ses
const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
    // quantos outros providers quiser
};

// obriga o constructor ser executado com o registerInstance
// e continua sendo lido como um register singleton
// container resolve que faz a injeção de dependência e verifica constructor
// se tem a injeção de dependência
container.registerInstance<IMailProvider>(
    'MailProvider',
    providers[mailConfig.driver],
);
