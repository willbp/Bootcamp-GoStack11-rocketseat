import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    // recebe só o e-mail do user q esqueceu a senha
    email: string;
}
@injectable()
class SendForgotPasswordEmailService {
    // vou receber um repositório como parametro 'usersRepository'
    constructor(
        // repositório é utilizado para encontrar o user q quer recuperar
        // a senha pelo e-mail dele
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        // checar se o usuário existe
        const user = await this.usersRepository.findByEmail(email);

        // se o usuário não existir
        if (!user) {
            throw new AppError('User does not exists');
        }
        // após chegar q o user existe
        // gera token aqui
        const { token } = await this.userTokensRepository.generate(user.id);

        // passar caminho pro arquivo
        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        // vamos pegar nosso mailProvider
        // Para enviar email enviar todas infos ao msm tempo
        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: 'Recuperação de senha',
            templateData: {
                // qual template q vou utilizar, quando utiliza a var no template
                // deve a declarar no variables para aparecer no template
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}
export default SendForgotPasswordEmailService;
