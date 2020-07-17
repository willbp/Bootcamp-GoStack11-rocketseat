import { getRepository, Repository, Not } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

// Appointment = repositório
// @EntityRepository(Appointment) // A interface Repository recebe o Model(class) do repositório
class UsersRepository implements IUsersRepository {
    // a classe é responsável por fazer CRUD dos dados de appointment

    // crio variável private do tipo Repository e como parâmetro Appointment
    // a var ormRepository é um Repository do typeorm da nossa entidade de Appointment
    private ormRepository: Repository<User>;

    // constructor executa alguma coisa assim que o repositório for carregado
    constructor() {
        // getRepository() cria nosso repositório
        // quero buscar nosso repositório de Appointment
        this.ormRepository = getRepository(User);
    }

    // recebe id do user em string, e retorna promise com usuário ou undefined
    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);
        return user;
    }

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        // declara uma var users q vai receber array de todos usuários
        let users: User[];
        // se o except_user_id existir
        if (except_user_id) {
            // procura no banco todos que não forem = ao id do cara q ta procurando (except_user_id)
            users = await this.ormRepository.find({
                where: {
                    id: Not(except_user_id),
                },
            });
        } else {
            // se não tiver esse except_user_id n existir ele vai direto procurar no banco todos caras
            users = await this.ormRepository.find();
        }
        // retornar o array
        return users;
    }

    // recebe id em string, e retorna promise com usuário ou undefined
    public async findByEmail(email: string): Promise<User | undefined> {
        // procurar um usuário onde o email senha o msm e-mail de baixo
        // seja = ao q eu recebi encima
        const user = await this.ormRepository.findOne({ where: { email } });
        return user;
    }

    // create publico e async pq vai demorar um pouco pra executar
    // recebe os dados de ICreateAppointmentDTO
    // retorna uma Promise, que no final de tudo retorna um Appointment (vai criar um Appointment)
    public async create(userData: ICreateUserDTO): Promise<User> {
        // criar um usuário
        // no formato do banco de dados definidos em User a partir da
        // instanciação do ormRepository
        const user = this.ormRepository.create(userData);

        // salvar no banco
        await this.ormRepository.save(user);

        // retorno user
        return user;
    }

    // recebe usuário que eu quero salvar e retorna o próprio user salvo no bd
    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}
export default UsersRepository;
