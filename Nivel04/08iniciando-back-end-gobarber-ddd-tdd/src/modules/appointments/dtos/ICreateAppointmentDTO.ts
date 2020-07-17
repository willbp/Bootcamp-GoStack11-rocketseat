// vai definir o formato dos dados que eu preciso para criar um Appointment
export default interface ICreateAppointmentDTO {
    // para criar um Appointment eu preciso receber:
    provider_id: string;
    date: Date;
}
