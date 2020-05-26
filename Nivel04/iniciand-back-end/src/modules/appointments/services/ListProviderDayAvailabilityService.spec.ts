import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    // seja possivel listar a disponibilidade do day dos providers
    it('should be able to list the day availability from providers', async () => {
        // criar appointments em horas específicos
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

        // quando eu executar o método Date 'now' ele vai retornar a data
        // que a gente quiser
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            // essa é a hora atual, ou seja horários antes das 11=indisponiveis
            return new Date(2020, 4, 20, 11).getTime();
        });

        // chama nosso service
        const availability = await listProviderDayAvailability.execute({
            provider_id: 'qualquer',
            year: 2020,
            month: 5,
            day: 20,
            // service em si número correto do mes, após corrigo no JS
        });
        // espero que a resposta seja um array e que dentro dela tenha os dias
        // 20 e 21 com available false. o resto com available true
        // arrayContaining vefifica se o availability (resposta) é um array contendo
        // as infos (day 20,21...etc)
        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
            ]),
        );
    });
});
