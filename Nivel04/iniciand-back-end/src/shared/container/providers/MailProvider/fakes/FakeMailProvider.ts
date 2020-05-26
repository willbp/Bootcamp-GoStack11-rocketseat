// anotar os emails enviados dentro de uma variável
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
    // variável message 'variavel' mensagens q foram enviadas
    private messages: ISendMailDTO[] = [];

    // pego a message inteira no formato ISendMailDTO
    public async sendMail(message: ISendMailDTO): Promise<void> {
        // push->adiciona 'no array' neste caso
        this.messages.push(message);
    }
}
