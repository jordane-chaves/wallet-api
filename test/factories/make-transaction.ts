import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/entities/transaction'
import { PrismaTransactionMapper } from '@/infra/database/prisma/mappers/prisma-transaction-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
): Transaction {
  const transaction = Transaction.create(
    {
      customerId: new UniqueEntityID(),
      priceInCents: faker.number.int({ min: 0, max: 50000 }),
      type: faker.helpers.arrayElement(['income', 'transfer']),
      ...override,
    },
    id,
  )

  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransaction(
    data: Partial<TransactionProps> = {},
  ): Promise<Transaction> {
    const transaction = makeTransaction(data)

    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })

    return transaction
  }
}
