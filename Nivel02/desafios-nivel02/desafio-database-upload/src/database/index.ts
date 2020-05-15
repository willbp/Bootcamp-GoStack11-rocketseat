import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  // o que você está falando para o node é para mudar a porta para 5433 quando rodar o test e manter 5432 quando não for dev
  // pode reparar que tem um comando parecido com esse logo abaixo
  // dizendo para ele mudar para o banco gostack_desafio06_tests quando estiver no test
  return createConnection(
    Object.assign(defaultOptions, {
      name,
      port: process.env.NODE_ENV === 'test' ? 5433 : 5432,
      database:
        process.env.NODE_ENV === 'test'
          ? 'gostack_desafio06_tests'
          : defaultOptions.database,
    }),
  );
};
