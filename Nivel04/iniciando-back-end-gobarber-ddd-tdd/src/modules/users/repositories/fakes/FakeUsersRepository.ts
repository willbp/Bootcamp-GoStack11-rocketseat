import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
    // a classe é responsável por fazer CRUD dos dados de appointment
    // crio variável para armazenar os repositórios
    private users: User[] = [];

    // recebe id do user em string, e retorna promise com usuário ou undefined
    public async findById(id: string): Promise<User | undefined> {
        // encontrar nos usuários onde o id dele for = id recebido por parametro
        const findUser = this.users.find(user => user.id === id);
        return findUser;
    }

    // recebe id em string, e retorna promise com usuário ou undefined
    public async findByEmail(email: string): Promise<User | undefined> {
        // encontrar nos usuários onde o email dele for = email recebido por parametro
        const findUser = this.users.find(user => user.email === email);

        return findUser;
    }

    // create publico e async pq vai demorar um pouco pra executar
    // recebe os dados de ICreateAppointmentDTO
    // retorna uma Promise, que no final de tudo retorna um Appointment (vai criar um Appointment)
    public async create(userData: ICreateUserDTO): Promise<User> {
        // crio um novo objeto user
        const user = new User();

        // preencho os dados de dentro dele
        Object.assign(user, { id: uuid(), ...userData });

        // salvar (coloca o usuárior recem criado dentro do array)
        this.users.push(user);

        // retorno user ao final
        return user;
    }

    // recebe usuário que eu quero salvar e retorna o próprio user salvo no bd
    public async save(user: User): Promise<User> {
        // procura se o usuário já existe no meu array
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        // sobrescrever dentro do meu array de usuário
        // na posição encontrada 'findIndex' eu vou por este usuário
        // assim atualizando minha informação do usuário
        this.users[findIndex] = user;

        // retorna usuário atualizado final
        return user;
    }
}
export default UsersRepository;
