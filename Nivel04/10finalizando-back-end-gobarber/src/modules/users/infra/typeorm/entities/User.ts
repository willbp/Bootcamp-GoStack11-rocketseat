import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import uploadConfig from '@config/upload';

// Exclude-excluir campo da nossa classe campo password qdo for pro front-end não exista
// Expose - expor novo campo q n existe diretamente na classe
import { Exclude, Expose } from 'class-transformer';

// Decorator nome da nossa tabela (pega a função entity e envia a classe Appointment)
@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // pego avatar_url, retorno string (url)
    // em server.ts da pra ver que /files
    // mostra todos arquivos q tem dentro de uploads
    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | null {
        if (!this.avatar) {
            return null;
        }
        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.avatar}`;
            case 's3':
                return `http://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
            default:
                return null;
        }
    }
}
export default User;
