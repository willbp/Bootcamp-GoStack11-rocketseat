import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

// Decorator nome da nossa tabela (pega a função entity e envia a classe Appointment)
@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    // cria propriedade chamada provider (é uma instância da classe User)
    // De dentro do models>User.ts
    // abaixo estipula-se o tipo de relacionamento 1-1 | 1-n | n-n
    // devemos pensar do model de Appointments para o User
    // Muitos agendamentos para 1 usuário
    // função retorna qual model ele deve utilizar quando a var for chamada.
    @ManyToOne(() => User)
    // qual q é a coluna q vai identificar qual q é o usuário q agendou algo
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    //---
    // indico coluna no bd
    @Column()
    user_id: string;

    // faço relacionamento
    @ManyToOne(() => User)
    // qual coluna faz o relacionamento
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
export default Appointment;
