import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    // recebe user_id e retorna a lista de usuários
    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<Appointment[]> {
        // key do cache
        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        // buscar os appointments do cache
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cacheKey,
        );
        // let appointments;
        // se n tiver nada armazenado no cache
        if (!appointments) {
            // busca agendamento deste trabalhador
            appointments = await this.appointmentsRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    year,
                    month,
                    day,
                },
            );
            console.log('Buscou do banco');
            // salvar no cache o registro de um prestador, num ano/mes/dia especifico
            // de forma serializada
            await this.cacheProvider.save(cacheKey, classToClass(appointments));
        }

        return appointments;
    }
}
export default ListProviderAppointmentsService;
