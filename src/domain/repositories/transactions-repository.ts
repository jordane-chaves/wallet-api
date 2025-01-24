import { Transaction } from '../entities/transaction'

export abstract class TransactionsRepository {
  abstract calculateBalanceByCustomerId(customerId: string): Promise<number>
  abstract findById(id: string): Promise<Transaction | null>
  abstract save(transaction: Transaction): Promise<void>
  abstract create(transaction: Transaction): Promise<void>
}
