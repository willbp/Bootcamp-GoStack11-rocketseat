import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

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
}
