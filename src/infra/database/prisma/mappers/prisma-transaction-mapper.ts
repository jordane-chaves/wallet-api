import { Prisma, Transaction as PrismaTransaction } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/entities/transaction'

const toDomainTransactionTypeMapper: Record<
  PrismaTransaction['type'],
  TransactionProps['type']
> = {
  INCOME: 'income',
  REVERSE: 'reverse',
  TRANSFER: 'transfer',
}

const toPrismaTransactionTypeMapper: Record<
  TransactionProps['type'],
  PrismaTransaction['type']
> = {
  income: 'INCOME',
  reverse: 'REVERSE',
  transfer: 'TRANSFER',
}

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        recipientId: raw.recipientId
          ? new UniqueEntityID(raw.recipientId)
          : null,
        priceInCents: raw.priceInCents,
        type: toDomainTransactionTypeMapper[raw.type],
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id.toString(),
      customerId: transaction.customerId.toString(),
      recipientId: transaction.recipientId
        ? transaction.recipientId.toString()
        : null,
      priceInCents: transaction.priceInCents,
      type: toPrismaTransactionTypeMapper[transaction.type],
      createdAt: transaction.createdAt,
    }
  }
}
