import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    // informações para enviar um email, quem está enviando email, assunto
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    // no templateData espero receber o msm q tiver dentro de IParseMailTemplateDTO
    // que é template e variables
    templateData: IParseMailTemplateDTO;
}
