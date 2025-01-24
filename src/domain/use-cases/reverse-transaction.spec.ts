import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeTransaction } from '@/test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'

import { InvalidTransactionError } from './errors/invalid-transaction-error'
import { ReverseTransactionUseCase } from './reverse-transaction'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: ReverseTransactionUseCase

describe('Reverse Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new ReverseTransactionUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to reverse a transaction', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction(
        {
          customerId: new UniqueEntityID('customer-1'),
          recipientId: new UniqueEntityID('customer-2'),
          type: 'transfer',
        },
        new UniqueEntityID('transaction-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-2',
      transactionId: 'transaction-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionsRepository.items[0]).toMatchObject({
      type: 'reverse',
    })
  })

  it('should be reversed only by the recipient', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction(
        {
          customerId: new UniqueEntityID('customer-1'),
          type: 'transfer',
        },
        new UniqueEntityID('transaction-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      transactionId: 'transaction-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to reverse a not transfer transaction', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction(
        {
          customerId: new UniqueEntityID('customer-1'),
          type: 'income',
        },
        new UniqueEntityID('transaction-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-2',
      transactionId: 'transaction-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTransactionError)
  })
})
