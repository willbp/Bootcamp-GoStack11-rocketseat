import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;
    const allTrasaction = this.transactions;

    function calculate(type: 'income' | 'outcome', value: number): null {
      if (type === 'income') {
        income += value;
      } else {
        outcome += value;
      }
      return null;
    }
    // para cada item ele vai calcular e gerar o balance abaixo
    // o balance e um objeto com os 2 dados + a soma deles (total)
    // por isso tem q ter eles separados pra mostrar

    allTrasaction.forEach(item => calculate(item.type, item.value));

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    // incremento os valores contidos em Transaction
    const transaction = new Transaction({ title, value, type });

    // adiciona novo elemento na lista transactions
    this.transactions.push(transaction);

    // retorna novo registro
    return transaction;
  }
}

export default TransactionsRepository;
