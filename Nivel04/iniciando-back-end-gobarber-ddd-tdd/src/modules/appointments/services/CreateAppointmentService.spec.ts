import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

// Categorizar nossos testes
// Todos testes que tem dentro do describe são
// testes da funcionalidade CreateAppointment (sem palavra service só p/ padronizar)
describe('CreateAppointment', () => {
    // 'isto deve' - msm coisa q o test()
    // isto deve permitir criar um novo appointment
    it('should be able to create a new appointment', async () => {
        // instancio  porque tenho que chamar o Service'CreateAppointmentService'
        // Mas nesse Service ele tem um constructor que recebe uma var appointmentsRepository
        // que é do tipo IAppointmentsRepository
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        // para agora conseguir passar meu repositório fake para ele testar.
        // Tanto o fake quanto o service real esperam a variável no formato IAppointmentsRepository
        // assim conseguindo interceptar
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        // criou um novo appointment
        // e executou o service para verificar se o appointment foi criado
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123',
        });
        // para isso espero que o appointment tenha um id e provider_id
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    // não pode permitir 2 agendamentos no msm horario
    it('should not be able to create two appointments on the same time', async () => {
        // instancio  porque tenho que chamar o Service'CreateAppointmentService'
        // Mas nesse Service ele tem um constructor que recebe uma var appointmentsRepository
        // que é do tipo IAppointmentsRepository
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        // para agora conseguir passar meu repositório fake para ele testar.
        // Tanto o fake quanto o service real esperam a variável no formato IAppointmentsRepository
        // assim conseguindo interceptar
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 4, 10, 11);

        // criou um novo appointment
        // e executou o service para verificar se o appointment foi criado
        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
        });
        //
        // espero que este código rejeite e que mostre um erro
        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123',
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
