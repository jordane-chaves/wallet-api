import { Injectable } from '@nestjs/common'

import { Transaction } from '@/domain/entities/transaction'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'

import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaService) {}

  async calculateBalanceByCustomerId(customerId: string): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ customerId }, { recipientId: customerId }],
      },
    })

    const balance = transactions.reduce((result, transaction) => {
      const isRecipientCustomer =
        transaction.recipientId?.toString() === customerId

      if (transaction.type === 'INCOME') {
        return result + transaction.priceInCents
      }

      if (transaction.type === 'TRANSFER') {
        if (isRecipientCustomer) {
          return result + transaction.priceInCents
        } else {
          return result - transaction.priceInCents
        }
      }

      if (
        transaction.type === 'REVERSE' &&
        transaction.customerId.toString() === customerId
      ) {
        return result + transaction.priceInCents
      }

      return result
    }, 0)

    return balance
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      return null
    }

    return PrismaTransactionMapper.toDomain(transaction)
  }

  async save(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPrisma(transaction)

    await this.prisma.transaction.update({
      where: { id: data.id },
      data,
    })
  }

  async create(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPrisma(transaction)
    await this.prisma.transaction.create({ data })
  }
}
