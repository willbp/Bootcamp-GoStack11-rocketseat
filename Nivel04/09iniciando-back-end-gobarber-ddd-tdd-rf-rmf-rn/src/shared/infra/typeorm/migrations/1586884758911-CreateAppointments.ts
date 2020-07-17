import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1586884758911
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // oq é pra ser feito quando a migration for executada alterações ou criação de nova tabela..
        await queryRunner.createTable(
            new Table({
                name: 'appointments',
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
                        name: 'provider', // era pra ser provider_id se n for executar ciclo do update mostrado no video
                        type: 'varchar',
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
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
        await queryRunner.dropTable('appointments');
    }
}
