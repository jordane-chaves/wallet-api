import { Transaction } from '../entities/transaction'

export interface TransactionsRepository {
  calculateBalanceByCustomerId(customerId: string): Promise<number>
  findById(id: string): Promise<Transaction | null>
  save(transaction: Transaction): Promise<void>
  create(transaction: Transaction): Promise<void>
}
