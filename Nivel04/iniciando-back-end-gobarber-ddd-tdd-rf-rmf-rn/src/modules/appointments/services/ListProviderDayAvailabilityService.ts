import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// recebe o user_id
interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    // recebe user_id e retorna a lista de usuários
    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<IResponse> {
        // pegar os appointments do dia (agendamentos)
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        );
        // e pego os horários disponíveis que eu tenho no dia
        const hourStart = 8;

        // crio um array, limite de 10 posições (8-17)=10 horas
        // valor+indice => indice+hora de inicio
        // agora tenho todos horários
        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        // pego a hora atual
        const currentDate = new Date(Date.now());

        // agora crio array de availability percorre o array
        const availability = eachHourArray.map(hour => {
            // verifica se existe um appointment  nesse horario
            // que seja igual ao horário passado no param.
            // se existir não está disponivel o horário !hasAppointmentInHour
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            // pego data do agendamento completo do param e a hora vem do map
            // 8,9,10..
            const compareDate = new Date(year, month - 1, day, hour);

            // retorna horarios e se está dispnível ou não
            return {
                hour, // disponivel=npode ter agendamento e o horário do compareDate
                // tem que ser após o horário atual
                available:
                    !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}
export default ListProviderDayAvailabilityService;
