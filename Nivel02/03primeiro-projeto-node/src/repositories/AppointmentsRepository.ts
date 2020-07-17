import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

// a classe é responsável por fazer
// CRUD dos dados de appointment
class AppointmentsRepository {
    // precisa q a lista de Appointments seja armazenada aqui também
    // o repositório é responsável por armazenar as informações sobre
    // estes métodos "CRUD" que posso fazer encima dos meus dados
    private appointments: Appointment[];
    // appointments var q vai ser salva aqui dentro e não acessível por fora da classe

    constructor() {
        // inicializa a variável appointments
        this.appointments = [];
    }

    // retorna TODOS agendamentos.
    public all(): Appointment[] {
        return this.appointments;
    }

    public findByDate(date: Date): Appointment | null {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(date, appointment.date),
        );
        // encontra somente um por data
        // se tiver findAppointment retorna ele, se não retorna null
        return findAppointment || null;
    }

    // criação de um  appointment-agendamento
    // data=objeto que contem
    public create({ provider, date }: CreateAppointmentDTO): Appointment {
        // retorno no mesmo formato do model de Appointment
        const appointment = new Appointment({ provider, date });
        // passada pelo public create

        // salva o novo appointment dentro "da minha lista" appointments
        this.appointments.push(appointment);

        return appointment;
    }
}
export default AppointmentsRepository;
