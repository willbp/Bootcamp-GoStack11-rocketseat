// import { EntityRepository, Repository } from 'typeorm';
import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../entities/Appointment';
//
// Appointment = repositório
// @EntityRepository(Appointment) // A interface Repository recebe o Model(class) do repositório
class AppointmentsRepository implements IAppointmentsRepository {
    // a classe é responsável por fazer CRUD dos dados de appointment

    // crio variável private do tipo Repository e como parâmetro Appointment
    // a var ormRepository é um Repository do typeorm da nossa entidade de Appointment
    private ormRepository: Repository<Appointment>;

    // constructor executa alguma coisa assim que o repositório for carregado
    constructor() {
        // getRepository() cria nosso repositório
        // quero buscar nosso repositório de Appointment
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // O retorno de uma função async sempre vai ser uma Promisse
        // e dentro dela qual o retorno da Promise "Appointment" ou null

        // encontrar um appointment 'onde' date seja=date
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        // encontra somente um por data
        // se tiver findAppointment retorna ele, se não retorna null
        return findAppointment;
    }

    // create publico e async pq vai demorar um pouco pra executar
    // recebe os dados de ICreateAppointmentDTO
    // retorna uma Promise, que no final de tudo retorna um Appointment (vai criar um Appointment)
    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        // criar um usuário
        const appointment = this.ormRepository.create({ provider_id, date });

        // salvar no banco
        await this.ormRepository.save(appointment);

        // retorno appointment
        return appointment;
    }
}
export default AppointmentsRepository;
