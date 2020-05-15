// import { EntityRepository, Repository } from 'typeorm';
import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
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

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        // conversor de data 1 2 -> 01 02
        // pego mês do param converto para string
        // padStart se minha string n tiver 2 digitos eu preencho
        // a esquerda pad'start' com 0
        const parsedMonth = String(month).padStart(2, '0');
        console.log(provider_id);
        // quero encontrar vários
        const appointments = await this.ormRepository.find({
            where: {
                provider_id, // qdo o provider_id for o msm do pego do param
                // raw texto direto passado pro postgres sem interpretação
                // pode receber uma função, pois o typeorm n chamada o campo de date
                // o typeorm coloca prefixo nos campos aleatoriamente
                // para pegar esse prefixo utilizaremos função e ficará
                // salvo dentro de dateFieldName
                // converte info para tipo string e converte para este tipo de date
                // e verifico a variável month e year
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
        console.log('batataaaa');

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        // conversor de data 1 2 -> 01 02
        // pego mês do param converto para string
        // padStart se minha string n tiver 2 digitos eu preencho
        // a esquerda pad'start' com 0
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        // quero encontrar vários
        const appointments = await this.ormRepository.find({
            where: {
                provider_id, // qdo o provider_id for o msm do pego do param
                // raw texto direto passado pro postgres sem interpretação
                // pode receber uma função, pois o typeorm n chamada o campo de date
                // o typeorm coloca prefixo nos campos aleatoriamente
                // para pegar esse prefixo utilizaremos função e ficará
                // salvo dentro de dateFieldName
                // converte info para tipo string e converte para este tipo de date
                // e verifico a variável month e year
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
        });
        return appointments;
    }

    // create publico e async pq vai demorar um pouco pra executar
    // recebe os dados de ICreateAppointmentDTO
    // retorna uma Promise, que no final de tudo retorna um Appointment (vai criar um Appointment)
    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        // criar um usuário
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });

        // salvar no banco
        await this.ormRepository.save(appointment);

        // retorno appointment
        return appointment;
    }
}
export default AppointmentsRepository;
