import handlebars from 'handlebars';
import fs from 'fs';

import IParseMaisTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

// implementation vai dar o funcionamento.
// implements define como ela deve se comportar
class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    // IParseMaisTemplateDTO consigo pegar variables e template e retorna string
    public async parse({
        file,
        variables,
    }: IParseMaisTemplateDTO): Promise<string> {
        // fs= file system le os dados desse arquivo (forgot_password.hbs)
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        // crio var e compila a string do template
        const parseTemplate = handlebars.compile(templateFileContent);

        // retorna função 'este é uma função' passando as variables
        return parseTemplate(variables);
    }
}
export default HandlebarsMailTemplateProvider;
