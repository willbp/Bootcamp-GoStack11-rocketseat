import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

// para alterar o perfil dele vamos precisar de
interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string; // pode ou não alterar a senha
}
@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    // recebe o id do user q quer att o avatar e o nome do avatar
    public async execute({
        user_id,
        name,
        email,
        old_password,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        // se n existir usuário
        if (!user) {
            throw new AppError('User not found');
        }

        // verifico se existe um usuário com este e-mail q ele quer trocar
        const userWithUpdatedEmail = await this.usersRepository.findByEmail(
            email,
        );
        // se n existir usuário e se o id do user q procuramos o email é != do meu user
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('E-mail already in use');
        }
        // password informado e oldpassword não informado
        if (password && !old_password) {
            throw new AppError(
                'You need to inform the old password to set a new password',
            );
        }

        // se o password estiver preenchido e o old_password também
        if (password && old_password) {
            // comparar a senha que está armazenada, com a oldPassword informada
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );
            // se não for a mesma senha
            if (!checkOldPassword) {
                throw new AppError('Old password does not match');
            }

            // gera o hash da nova senha
            user.password = await this.hashProvider.generateHash(password);
        }

        // para atualizar um usuário
        user.name = name;
        user.email = email;

        // salva e retorna o user
        return this.usersRepository.save(user);
    }
}
export default UpdateProfileService;
