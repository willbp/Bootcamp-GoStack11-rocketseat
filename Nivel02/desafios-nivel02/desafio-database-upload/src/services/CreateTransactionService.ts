import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  // receber a categoria no formato string
  private async setCategory(category: string): Promise<string> {
    // repositorio Category
    const repository = getRepository(Category);

    // busco com findOne no banco pelo título
    const getCategory = await repository.findOne({
      where: { title: category },
    });

    // se não retornar nada
    // eu crio o objeto category e gravo em setCategory
    if (!getCategory) {
      const setCategory = repository.create({ title: category });
      // depois eu salvo no banco
      await repository.save(setCategory);

      // depois dou um return no setCategory.id porque minha função retorna uma string
      return setCategory.id;

      // se ele não cair nessa condição, significa que eu tenho uma categoria cadastrada
    }

    return getCategory.id;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // habilitando CRUD
    const repository = getCustomRepository(TransactionsRepository);

    const balance = (await repository.getBalance()).total;

    if (type === 'outcome' && balance < value) {
      throw new AppError('Saldo Insuficiente');
    }

    const category_id = await this.setCategory(category);

    // cria a instância da classe de Category
    const transaction = repository.create({
      title,
      value,
      type,
      category_id,
    });

    // salva no banco de dados
    await repository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
