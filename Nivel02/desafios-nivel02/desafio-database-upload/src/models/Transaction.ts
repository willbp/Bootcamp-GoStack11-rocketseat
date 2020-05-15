import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column() // @Column('decimal')
  value: number;

  @Column()
  category_id: string;

  // ele une Category com Transaction através do category_id
  @ManyToOne(() => Category, category => category.transaction, { eager: true }) // muitas categorias para uma transação
  @JoinColumn({ name: 'category_id' }) // unindo colunas pelo nome category_id
  category: Category; // devolvendo um objeto do tipo Category acessível pelo parâmetro category

  // ele une os 2 models através de category_id ele instancia os 2 (category com transaction)
  // só funciona pq tem FK

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
