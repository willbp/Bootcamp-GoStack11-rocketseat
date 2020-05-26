import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
    // define as propriedades que nosso serviço de envio de e-mail
    // deve oferecer para nossa aplicação

    // método sendMail que recebe pra quem vai ser enviado o email, e corpo do email
    // no formato ISendMailDTO
    sendMail(data: ISendMailDTO): Promise<void>;
}
