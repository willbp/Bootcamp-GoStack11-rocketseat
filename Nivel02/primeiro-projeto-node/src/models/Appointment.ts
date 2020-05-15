import { uuid } from 'uuidv4';

class Appointment {
    id: string;

    provider: string;

    date: Date;

    // pega todos tipos de Appointment e omite o id
    // pois ele espera o id no constructor
    constructor({ provider, date }: Omit<Appointment, 'id'>) {
        // para passar parâmetros
        // por dentro de new Appointments()
        // para criar a classe
        // Appointment baseada em informações pré existentes;
        this.id = uuid();
        this.provider = provider;
        this.date = date;
    }
}
export default Appointment;
