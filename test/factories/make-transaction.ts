import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/entities/transaction'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
): Transaction {
  const transaction = Transaction.create(
    {
      customerId: new UniqueEntityID(),
      priceInCents: faker.number.int(),
      type: faker.helpers.arrayElement(['income', 'transfer']),
      ...override,
    },
    id,
  )

  return transaction
}
