import { uuid } from 'uuidv4';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { isEqual } from 'date-fns';
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

    // create publico e async pq vai demorar um pouco pra executar
    // recebe os dados de ICreateAppointmentDTO
    // retorna uma Promise, que no final de tudo retorna um Appointment (vai criar um Appointment)
    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        // criar appointment na mão
        const appointment = new Appointment();

        // preencher info de provider_id e date dentro do Appointment
        // ou como nas linhas de baixo
        Object.assign(appointment, { id: uuid(), date, provider_id });

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
