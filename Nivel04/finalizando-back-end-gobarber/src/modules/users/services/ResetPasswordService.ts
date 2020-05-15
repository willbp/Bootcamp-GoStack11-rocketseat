import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    // recebo token gerado da alteração da senha e a nova senha do usuário
    token: string;
    password: string;
}
@injectable()
class ResetPasswordService {
    // vou receber um repositório como parametro 'usersRepository'
    constructor(
        // repositório é utilizado para encontrar o user q quer recuperar
        // a senha pelo e-mail dele
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        // injetar Hash
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        // aqui dentro vai a lógica para conseguir trocar a senha
        // encontrar um usuário através de um token

        // encontro usertoken
        const userToken = await this.userTokensRepository.findByToken(token);
        // se user token n existir = erro
        if (!userToken) {
            throw new AppError('User token does not exists');
        }
        // encontro usuário
        const user = await this.usersRepository.findById(userToken.user_id);

        // caso usuário não exista
        if (!user) {
            throw new AppError('User does not exists');
        }

        // pega data de criação do meu token
        const tokenCreatedAt = userToken.created_at;
        // adiciona 2 horas ao tokenCreatedAt
        const compareDate = addHours(tokenCreatedAt, 2);

        // verifica se ja passamos da hora limite de expirar o token
        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired');
        }

        // pega a nova senha do user e a faz a criptografia
        user.password = await this.hashProvider.generateHash(password);

        // salva
        await this.usersRepository.save(user);
    }
}
export default ResetPasswordService;
