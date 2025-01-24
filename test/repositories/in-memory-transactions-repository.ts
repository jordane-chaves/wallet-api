import { Transaction } from '@/domain/entities/transaction'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async calculateBalanceByCustomerId(customerId: string): Promise<number> {
    const customerTransactions = this.items.filter((item) => {
      return (
        item.customerId.toString() === customerId ||
        item.recipientId?.toString() === customerId
      )
    })

    const balance = customerTransactions.reduce((result, transaction) => {
      if (transaction.type === 'income') {
        return result + transaction.priceInCents
      } else if (transaction.type === 'reverse') {
        return result + transaction.priceInCents
      }

      if (transaction.recipientId?.toString() === customerId) {
        return result + transaction.priceInCents
      }

      return result - transaction.priceInCents
    }, 0)

    return balance
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find((item) => item.id.toString() === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }

  async save(transaction: Transaction): Promise<void> {
    const itemIndex = this.items.findIndex((item) => {
      return item.id.equals(transaction.id)
    })

    if (itemIndex >= 0) {
      this.items[itemIndex] = transaction
    }
  }
}
