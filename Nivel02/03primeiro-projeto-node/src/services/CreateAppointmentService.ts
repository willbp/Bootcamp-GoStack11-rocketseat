import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
// recebimento de informações
// tratativa de erros/excessões
// acesso ao repositório

// recebendo dados do service
interface Request {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;

    // criando construtor assim, todos services criados terão acesso ao mesmo repositório de appointments
    constructor(appointmentsRepository: AppointmentsRepository) {
        // recebe dependencia pelo constructor, como uma variavel do constructor
        // a var laranja é do tipo AppointmentsRepository (instancia da classe azul)
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({ date, provider }: Request): Appointment {
        // startOfHour regra de negócio agendamento acontece de hora em hora
        // inicializa hora sempre em tempos fechados segundos/mili = 0
        const appointmentDate = startOfHour(date);

        // verificação.. se der certo ele retorna 1 appointment caso exista já 1 agendamento na mesma data
        // Vai em appointmentsRepository.ts entra em findByDate, retorna a date para findAppointmentInSameDate
        // caso já exista agendamento para aquela date, caso não encontre, retorna null
        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            // em caso de erro retorna throw pois o service não tem acesso ao response
            throw Error('This appointment is already booked');
            // após migrar para nossa rota
            // O service não tem acesso aos dados das requisições e nem as respostas
            // Ele tem acesso somente ao request q vem como dados (acima) e retorna algo "throw erros"
        }
        const appointment = this.appointmentsRepository.create({
            // envia objetos
            provider,
            date: appointmentDate,
        });
        return appointment;
    }
}
export default CreateAppointmentService;
