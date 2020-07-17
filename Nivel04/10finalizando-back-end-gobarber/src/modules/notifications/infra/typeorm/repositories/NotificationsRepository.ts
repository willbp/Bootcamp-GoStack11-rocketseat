import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
// importo model (schema/table)
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    // a classe é responsável por fazer CRUD dos dados de Notification

    // crio variável private do tipo Repository e como parâmetro Notification
    // a var ormRepository é um Repository do typeorm da nossa entidade de Notification
    private ormRepository: MongoRepository<Notification>;

    // constructor executa alguma coisa assim que o repositório for carregado
    constructor() {
        // getRepository() cria nosso repositório
        // quero buscar nosso repositório de Notification
        // 'mongo' name do banco do ormconfig
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        // criar nova notificação
        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });

        // salvar no banco
        await this.ormRepository.save(notification);

        // retorno notification
        return notification;
    }
}
export default NotificationsRepository;
