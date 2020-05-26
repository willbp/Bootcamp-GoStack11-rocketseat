import {
    ObjectID,
    ObjectIdColumn,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

// nome do schema (table) dentro do mongo
@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    id: ObjectID; // id específico armazenado no mongo

    @Column()
    content: string; // conteúdo/texto da notificação

    // para quem eu quero mandar a notificação (armazena uuid) do user
    // uuid do outro banco
    @Column('uuid')
    recipient_id: string;

    // indica q o user n leu já no start
    // default pois não temos migration para definir a nivel de banco o valor
    @Column({ default: false })
    read: boolean; // verifica se a notificação foi lida ou não

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
export default Notification;
