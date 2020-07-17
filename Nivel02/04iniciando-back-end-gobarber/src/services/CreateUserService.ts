import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

// O método de execute vai lidar com retorno do user do CreateUserService
// através do Promise<User>
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        // receber nome, email e password, para isto crio uma interface

        // habilitando CRUD
        const usersRepository = getRepository(User);

        // tratando usuário duplicado
        const checkUserExists = await usersRepository.findOne({
            where: { email }, // verifica se o email é o mesmo do recebido no execute
        });

        if (checkUserExists) {
            throw new AppError('Email adress already used.');
        }

        const hashedPassword = await hash(password, 8);

        // cria a instância da classe de User
        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // salva no banco de dados
        await usersRepository.save(user);

        // retorna usuário criado
        return user;
    }
}
export default CreateUserService;
