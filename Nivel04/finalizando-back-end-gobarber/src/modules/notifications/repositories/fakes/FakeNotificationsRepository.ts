import { ObjectID } from 'mongodb';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
// importo model (schema/table)
import Notification from '../../infra/typeorm/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    // salvar notificações em um array
    private notifications: Notification[] = [];

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        // instancio os dados que temos declarados pra notification
        const notification = new Notification();

        // preencho a notificação com os dados de ICreateNotificationDTO
        // content, recipient_id e o id único de cada user
        Object.assign(notification, {
            id: new ObjectID(),
            content,
            recipient_id,
        });

        // salvar notificação
        this.notifications.push(notification);

        // retorno notification
        return notification;
    }
}
export default NotificationsRepository;
