import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';
//
// Appointment = repositório
@EntityRepository(Appointment) // A interface Repository recebe o Model(class) do repositório
class AppointmentsRepository extends Repository<Appointment> {
    // a classe é responsável por fazer CRUD dos dados de appointment

    public async findByDate(date: Date): Promise<Appointment | null> {
        // O retorno de uma função async sempre vai ser uma Promisse
        // e dentro dela qual o retorno da Promise "Appointment" ou null

        // encontrar um appointment 'onde' date seja=date
        const findAppointment = await this.findOne({
            where: { date },
        });

        // encontra somente um por data
        // se tiver findAppointment retorna ele, se não retorna null
        return findAppointment || null;
    }
}
export default AppointmentsRepository;
