import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    // Fazer a listagem do prestador de serviço, vendo os agendamentos q ele tem nesse dia.
    it('should be able to list the appointments on a specific day', async () => {
        // criar prestador de serviço, colocar agendamentos nele e ver se retorna
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 30, 8).getTime();
        });
        // cria agendamento passando id de provider e de user
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 30, 14, 0, 0),
        });
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 30, 8).getTime();
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 30, 15, 0, 0),
        });

        // chama nosso service
        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 30,
            // service em si número correto do mes, após corrigo no JS
        });
        // espero que appointments, seja igual a um array com as 2 infos.
        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
