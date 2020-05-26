import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
// import da entidade (table), porque o retorno da Promise é uma notification
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
    // método create q vai receber data (todos dados), do tipoICreateNotificationDTO
    // e vamos separar ele em um DTO para desestruturar os dados
    // e retorna uma Notification
    create(data: ICreateNotificationDTO): Promise<Notification>;
}
