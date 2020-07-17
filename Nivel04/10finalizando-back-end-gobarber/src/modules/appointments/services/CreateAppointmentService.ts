import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
// recebimento de informações           // tratativa de erros/excessões        // acesso ao repositório

// recebendo dados do service
interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}
@injectable() // denomina que esta classe pode receber injeção de dependências
class CreateAppointmentService {
    // constructor +var private appointment.. do tipo IAppointmentsRepository
    constructor(
        // injeta uma var aqui dentro 'repositório'
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        date,
        user_id,
        provider_id,
    }: IRequest): Promise<Appointment> {
        // libera todos métodos findOne, save, update

        // startOfHour regra de negócio agendamento acontece de hora em hora
        // inicializa hora sempre em tempos fechados segundos/mili = 0
        const appointmentDate = startOfHour(date);

        // se esta data for antes de agoraa
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                "You can't create an appointment on a past date.",
            );
        }

        // se o id do usuário for igual ao id do provider
        if (user_id === provider_id) {
            throw new AppError(
                "You can't create an appointment with yourself.",
            );
        }
        // se a hora da data do agendamento for <8 ou >17
        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You only can create appointments between 8am and 5pm',
            );
        }

        // verificação.. se der certo ele retorna 1 appointment caso exista já 1 agendamento na mesma data
        // Vai em appointmentsRepository.ts entra em findByDate, retorna a date para findAppointmentInSameDate
        // caso já exista agendamento para aquela date, caso não encontre, retorna null
        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate, // await pois findByDate é uma promise
            provider_id,
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
            user_id,
            date: appointmentDate,
        });

        // pego a data do agendamento formatada
        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        // cria notificação
        await this.notificationsRepository.create({
            recipient_id: provider_id, // para quem vamos enviar a notificação
            content: `Novo agendamento para dia ${dateFormatted}`, // conteudo da notificação
        });

        // invalidar agendamentos de um provider específico em um dia,mes,ano especifico
        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(
                appointmentDate,
                'yyyy-M-d',
            )}`,
        );

        // para salvar no BD
        // await appointmentsRepository.save(appointment);
        return appointment;
    }
}
export default CreateAppointmentService;
