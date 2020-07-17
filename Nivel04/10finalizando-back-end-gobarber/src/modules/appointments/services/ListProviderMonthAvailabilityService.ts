import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// recebe o user_id
interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    // recebe user_id e retorna a lista de usuários
    public async execute({
        provider_id,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        // vamos buscar os appointments
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                // agora posso passar as vars aqui dentro
                provider_id,
                year,
                month,
            },
        );
        console.log('batata');
        // passa uma data, ano mês -1
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        // montar um array com o número de dias
        // para cada dia do mês
        // criar array a partir de obções 'objeto com tamanho do array'
        // função q recebe valor do array, indice q é 0
        // então indice+1 começa em 1
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        // agora percorro as informações acima, recebo o dia
        // verifico se tem um appointment agendado neste dia em especifico
        const availability = eachDayArray.map(day => {
            // pego o último horário do dia atual do meu calendario do 'sistema'
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            // retorno desse array um objeto no formado day e available
            return {
                day,
                available:
                    // verifico a data do sistema compareDate é depois de agora.
                    // se for está disponível, retorna os dias após hoje
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10, // se tiver 1 agendamento ao menos
            };
        });
        return availability;
    }
}
export default ListProviderMonthAvailabilityService;
