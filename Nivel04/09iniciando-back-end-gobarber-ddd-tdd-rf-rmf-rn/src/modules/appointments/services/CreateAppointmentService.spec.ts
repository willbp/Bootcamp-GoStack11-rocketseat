import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

// Categorizar nossos testes
// Todos testes que tem dentro do describe são
// testes da funcionalidade CreateAppointment (sem palavra service só p/ padronizar)
describe('CreateAppointment', () => {
    beforeEach(() => {
        // instancio  porque tenho que chamar o Service'CreateAppointmentService'
        // Mas nesse Service ele tem um constructor que recebe uma var appointmentsRepository
        // que é do tipo IAppointmentsRepository
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        // para agora conseguir passar meu repositório fake para ele testar.
        // Tanto o fake quanto o service real esperam a variável no formato IAppointmentsRepository
        // assim conseguindo interceptar
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    // 'isto deve' - msm coisa q o test()
    // isto deve permitir criar um novo appointment
    it('should be able to create a new appointment', async () => {
        // diz o dia e hora atual
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });
        // criou um novo appointment
        // e executou o service para verificar se o appointment foi criado
        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'user-id',
            provider_id: 'provider-id',
        });
        // para isso espero que o appointment tenha um id e provider_id
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider-id');
    });

    // não pode permitir 2 agendamentos no msm horario
    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date(2020, 4, 10, 11);
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });
        // criou um novo appointment
        // e executou o service para verificar se o appointment foi criado
        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        });
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });
        // espero que este código rejeite e que mostre um erro
        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // não permitir agendamento de data passada
    it('should not be able to create two appointments on past date', async () => {
        // vou simular qdo o método Date now for chamado dou um novo valor pra ele
        // função para reescrever/fazer oq eu quiser
        // retorno nova data
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        // agora faremos uma requisição de agendamento e na data
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    // -Não podemos criar um agendamento com o mesmo provider sendo o provider quem está agendando.
    // o 'user_id' n pode ser o mesmo  'provider_id.
    it('should not be able to create an appointment with same user as provider', async () => {
        // vou simular qdo o método Date now for chamado dou um novo valor pra ele
        // função para reescrever/fazer oq eu quiser
        // retorno nova data
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        // agora faremos uma requisição de agendamento e na data
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'user-id',
                provider_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    // - Os agendamentos devem estar disponíveis entre as 8 e as 18 (primeiro horário as 8 ultimo as 17)
    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        // vou simular qdo o método Date now for chamado dou um novo valor pra ele
        // função para reescrever/fazer oq eu quiser
        // retorno nova data
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        // agora faremos uma requisição de agendamento e na data
        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 14, 7),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 14, 18),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

/*
// verificar soma de 2 números
// titulo do teste:sum two numbers
test('sum two numbers', () => {
    // o que eu espero que o teste me devolva/mostre de informações
    expect(1 + 2).toBe(3); // 1+2 seja 3
});
*/
