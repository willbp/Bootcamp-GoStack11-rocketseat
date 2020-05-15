import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
// recebimento de informações           // tratativa de erros/excessões        // acesso ao repositório

// recebendo dados do service
interface IRequest {
    provider_id: string;
    date: Date;
}
@injectable() // denomina que esta classe pode receber injeção de dependências
class CreateAppointmentService {
    // constructor +var private appointment.. do tipo IAppointmentsRepository
    constructor(
        // injeta uma var aqui dentro 'repositório'
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        date,
        provider_id,
    }: IRequest): Promise<Appointment> {
        // libera todos métodos findOne, save, update

        // startOfHour regra de negócio agendamento acontece de hora em hora
        // inicializa hora sempre em tempos fechados segundos/mili = 0
        const appointmentDate = startOfHour(date);

        // verificação.. se der certo ele retorna 1 appointment caso exista já 1 agendamento na mesma data
        // Vai em appointmentsRepository.ts entra em findByDate, retorna a date para findAppointmentInSameDate
        // caso já exista agendamento para aquela date, caso não encontre, retorna null
        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate, // await pois findByDate é uma promise
        );

        if (findAppointmentInSameDate) {
            // em caso de erro retorna throw pois o service não tem acesso ao response
            throw new AppError('This appointment is already booked');
            // após migrar para nossa rota
            // O service não tem acesso aos dados das requisições e nem as respostas
            // Ele tem acesso somente ao request q vem como dados (acima) e retorna algo "throw erros"
        }
        const appointment = await this.appointmentsRepository.create({
            // envia objetos
            provider_id,
            date: appointmentDate,
        });

        // para salvar no BD
        // await appointmentsRepository.save(appointment);
        return appointment;
    }
}
export default CreateAppointmentService;
