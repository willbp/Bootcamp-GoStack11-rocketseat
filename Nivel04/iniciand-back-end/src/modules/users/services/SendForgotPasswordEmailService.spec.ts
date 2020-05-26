import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

// cria variável como global do tipo 'tal'
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

// foi no service e mandou email somente, o restante das regras de negócios quem define
// é os outros testes da app. exemplo 'mandar e-mail pra um cara q nem existe'
// neste teste ele só está verificando se o e-mail foi enviado
describe('SendForgotPasswordEmail', () => {
    // preenche informações do let
    // antes de cada um dos testes eu quero preencher as informações com novas infos.
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        fakeMailProvider = new FakeMailProvider();

        fakeUserTokenRepository = new FakeUserTokenRepository();

        // o que acontece quando o código é disparado
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokenRepository,
        );
    });

    it('should be able to recover the password using the e-mail', async () => {
        // verifica se o função sendMail foi chamado, verificando se ele foi enviado
        // identifica se o função sendMail foi enviado.
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        // cria user pra verificar existencia
        await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // quando chamado ele recebe só o e-mail
        await sendForgotPasswordEmail.execute({
            email: 'willa@gosta.com',
        });
        // espero que a função sendMail tenha sido chamada
        expect(sendMail).toHaveBeenCalled();
    });

    // Teste para não permitir que um usuário não exista tente fazer uma recuperação de senha
    it('should not be able to recover a non-existing user password', async () => {
        // parecido com o de cima, porém pula a lógica de criação de usuário
        // e vamos direto para a recuperação de senha

        // espero que quando for executado de um reject e o resultado dela seja um AppError
        // await expect devido ao toBeInstanceOf
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'willa@gosta.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // testar se qdo fizer rec de senha valida ele gera o token
    it('should generate a forgot password token', async () => {
        // spy porque generate deve ser chamado para faze a rec. de senha
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        // cria user pra verificar existencia
        const user = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        // quando chamado ele recebe só o e-mail
        await sendForgotPasswordEmail.execute({
            email: 'willa@gosta.com',
        });
        // espero que o generateToken tenha sido chamado passando o id do user como parâmetro
        // assim simulando q está sendo gerado um token para este user na rec de senha
        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
