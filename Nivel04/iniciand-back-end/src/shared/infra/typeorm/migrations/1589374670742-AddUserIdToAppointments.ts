import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1589374670742
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
                // true pensando q mesmo ele deletando a conta
                // o prestador de serviço vai ter o historico de agendamentos
                // anterior dele
            }),
        );
        // cria uma foreign key apelidada de AppointmentUser
        // A foreign key será criada da tabela appointments (campo user_id)
        // para o campo id da tabela users
        // caso o id for deletado, será setado como null
        // caso id seja alterado ele será alterado também "cascade"
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentUser',
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL', // RESTRICT, SET NULL, CASCADE
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // desfazer na ordem reversa SEMPRE
        await queryRunner.dropForeignKey('appointments', 'AppointmentUser'); // apelido
        await queryRunner.dropColumn('appointments', 'user_id');
    }
}
