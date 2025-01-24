import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from '@/test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'

import { CannotTransferYourselfError } from './errors/cannot-transfer-yourself-error'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'
import { TransferUseCase } from './transfer'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: TransferUseCase

describe('Transfer', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new TransferUseCase(inMemoryTransactionsRepository)
  })

  it('should transfer to another user', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 5000,
        type: 'income',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      recipientId: 'customer-2',
      priceInCents: 5000,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      transaction: inMemoryTransactionsRepository.items[1],
    })
  })

  it('should not transfer to yourself', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 5000,
        type: 'income',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      recipientId: 'customer-1',
      priceInCents: 1000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CannotTransferYourselfError)
  })

  it('should not transfer with insufficient balance', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 1000,
        type: 'income',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      recipientId: 'customer-2',
      priceInCents: 1001,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InsufficientBalanceError)
  })
})
