import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
    // create recebe infos e retornar Appointment criado
    // vai demorar para criar e salvar, então é um Promise e
    // retorna um Appointment assim que for criado
    // dados que recebe - data:ICreateAppointmentDTO
    create(data: ICreateAppointmentDTO): Promise<Appointment>;

    // adiciona métodos findByDate
    // recebe date
    // devolve uma promise retornando Appointment ou null=undefined
    findByDate(date: Date): Promise<Appointment | undefined>;

    // recebe data no formato de IFindAllInMonthFromProvider e retorna array Appointment
    // podendo ele ser vazio
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProviderDTO,
    ): Promise<Appointment[]>;

    // procurar todos agendamentos do dia de um prestador
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviderDTO,
    ): Promise<Appointment[]>;
}
