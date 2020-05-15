// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    // seja possivel listar a disponibilidade do mês dos providers
    it('should be able to list the month availability from providers', async () => {
        // criar appointments em dias específicos
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 11, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 13, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 16, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 20, 17, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'qualquer',
            user_id: 'qualqueruser',
            date: new Date(2020, 4, 21, 8, 0, 0),
            // date no JS mes 4=5
        });

        // chama nosso service
        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'qualquer',
            // n tem user id pq quer saber disponibilidade deste provider
            // n tem nada a ver com o usuário.
            year: 2020,
            month: 5,
            // service em si número correto do mes, após corrigo no JS
        });
        // espero que a resposta seja um array e que dentro dela tenha os dias
        // 20 e 21 com available false. o resto com available true
        // arrayContaining vefifica se o availability (resposta) é um array contendo
        // as infos (day 20,21...etc)
        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
