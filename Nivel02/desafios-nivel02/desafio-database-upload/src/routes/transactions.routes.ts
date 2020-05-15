import { Router } from 'express';

import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

// instancia do multer (método array,single,etc)
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  // acessa classe transactionsRepository
  // e retorna para transactions (array) o resultado
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const CreateTransaction = new CreateTransactionService();
  const transaction = await CreateTransaction.execute({
    title,
    value,
    type,
    category,
  });
  // console.log(transaction);
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // id presente nos parâmetros da rota;
  const { id } = request.params;

  // instancia a classe DeleteTrasactionService,
  const deleteTransaction = new DeleteTransactionService();

  // executa a função para deletar 1 transaction pelo ID
  await deleteTransaction.execute({ id });

  // resposta bem sucedida
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importedFilename = request.file.filename;

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({ importedFilename });

    return response.json(transactions);
  },
);

export default transactionsRouter;
