import { uuid } from 'uuidv4';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    // salvando array de appointments do tipo array Appointment e inicia vazio
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // procura no array appointments se 'cada appointment tem a mesma data
        // do date que está recebendo como parâmetro na função
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );
        // se encontrar eu encontrei um appointment e retorno ele.
        return findAppointment;
    }

    // pega provider_id,month,year de IFindAllInMonthFromProviderDTO
    // e retorna um array de Appointment (varios appointments)
    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        // quero filtrar meus appointments
        // retornar só os agendamentos em q o provider.id seja o mesmo
        // provider.id passado pelo parametro e verificar se o mes do
        // meu appointment.date = month+1 por causa do JS e verificar
        // se o getYear do appointment.date = year q recebe por param
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });
        // se encontrar eu encontrei um appointment e retorno ele.
        return appointments;
    }

    // pega provider_id,month,year de IFindAllInDayFromProviderDTO
    // e retorna um array de Appointment (varios appointments)
    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        // quero filtrar meus appointments
        // retornar só os agendamentos em q o provider.id seja o mesmo
        // provider.id passado pelo parametro e verificar se o mes do
        // meu appointment.date = month+1 por causa do JS e verificar
        // se o getYear do appointment.date = year q recebe por param
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });
        // se encontrar eu encontrei um appointment e retorno ele.
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
        // criar appointment na mão
        const appointment = new Appointment();

        // preencher info de provider_id e date dentro do Appointment
        // ou como nas linhas de baixo
        Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

        // preencher info de provider_id e date dentro do Appointment
        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        // salvando este appointment no array appointments
        this.appointments.push(appointment);

        // retorna appointment criado
        return appointment;
    }
}
export default AppointmentsRepository;
