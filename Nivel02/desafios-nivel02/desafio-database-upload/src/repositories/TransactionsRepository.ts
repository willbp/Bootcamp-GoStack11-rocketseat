import { EntityRepository, Repository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
// import transactionsRouter from '../routes/transactions.routes';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const repository = getRepository(Transaction);

    const findTypeIncome = await repository.find({
      where: { type: 'income' },
    });
    const findTypeOutcome = await repository.find({
      where: { type: 'outcome' },
    });

    const somaIncome = findTypeIncome.reduce(
      (total, transaction) => total + transaction.value,
      0,
    );

    const somaOutcome = findTypeOutcome.reduce(
      (total, transaction) => total + transaction.value,
      0, // 0para somaoutcome primeira vez
    );

    const balance = {
      income: somaIncome,
      outcome: somaOutcome,
      total: somaIncome - somaOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
/**
    OU
    const transactions = await this.find();
    //this.find procura dentro do model Transaction (entity)

    const {income, outcome} = transactions.reduce(
      (accumulator, transaction)=>{
        switch(transaction.type){
          case: 'income':
            accumulator.outcome += Number(transaction.value);
            break;

            case 'outcome':
              accumulator.outcome += Number(transaction.value);
              break;

              default:
                break;
        }
          return accumulator;
        },
      {
        income:0,
        outcome:0,
        total:0,
      },
    );
    const total = income - outcome;

    return {income, outcome, total};
    }
*/
