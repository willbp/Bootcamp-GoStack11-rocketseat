import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsers1586954355211 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // oq é pra ser feito quando a migration for executada alterações ou criação de nova tabela..
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        // colunas id, provider..
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // utilizado como fallback (em caso de problema é possível voltar atrás)
        // faz o contrário do up "desfaz"
        await queryRunner.dropTable('users');
    }
}
