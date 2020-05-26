import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepositories {
    // ver oq por aqui baseado no services
    // findById
    // encontrar por email findByEmail
    // create para criar e salvar

    // lista todos providers, menos ele mesmo, retorna Lista de User
    findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
    // recebe o ID do user e retorna o user encontrado ou não
    findById(id: string): Promise<User | undefined>;
    // recebe o email do user e retorna o user encontrado ou não
    findByEmail(email: string): Promise<User | undefined>;
    // recebe todas informações do usuário
    // recebe os dados provindos de ICreateUserDTO
    // Promise e retorna o User dps que criar o user
    create(data: ICreateUserDTO): Promise<User>;
    // recebe um usuário para ser salvo no banco e retorna o mesmo usuário
    save(user: User): Promise<User>;
}
