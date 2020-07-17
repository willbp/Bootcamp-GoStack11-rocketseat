import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1586957842774
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('appointments', 'provider');
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }),
        );
        // cria uma foreign key apelidada de AppointmentProvider
        // A foreign key será criada da tabela appointments (campo provider_id)
        // para o campo id da tabela users
        // caso o id for deletado, será setado como null
        // caso id seja alterado ele será alterado também "cascade"
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentProvider',
                columnNames: ['provider_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL', // RESTRICT, SET NULL, CASCADE
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // desfazer na ordem reversa SEMPRE
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider'); // apelido
        await queryRunner.dropColumn('appointments', 'provider_id');
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }
}
