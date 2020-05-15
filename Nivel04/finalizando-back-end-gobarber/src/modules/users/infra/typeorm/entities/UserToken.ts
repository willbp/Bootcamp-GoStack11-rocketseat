import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Generated,
} from 'typeorm';

// Decorator nome da nossa tabela (pega a função entity e envia a classe Appointment)
@Entity('user_tokens')
class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // para armazenar tokens para a alteração de senhas
    // assim teremos 1 token único para cada alteração de senha
    @Column()
    @Generated('uuid')
    token: string;

    // referência a qual usuário o token acima pertence
    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
export default UserToken;
