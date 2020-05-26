import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';

import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';

const providers = {
    handlebars: HandlebarsMailTemplateProvider,
};

// retorna providers.handlebars
container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    providers.handlebars,
);
