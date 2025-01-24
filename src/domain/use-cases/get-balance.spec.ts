import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from '@/test/factories/make-transaction'
import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'

import { GetBalanceUseCase } from './get-balance'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: GetBalanceUseCase

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new GetBalanceUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to get a balance', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 5000,
        type: 'income',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        recipientId: new UniqueEntityID('customer-2'),
        priceInCents: 2000,
        type: 'transfer',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 10000,
        type: 'income',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        recipientId: new UniqueEntityID('customer-2'),
        priceInCents: 3000,
        type: 'reverse',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      balance: 16000,
    })
  })

  it('should sum received transference to the balance', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-2'),
        priceInCents: 10000,
        type: 'income',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        recipientId: new UniqueEntityID('customer-2'),
        priceInCents: 2000,
        type: 'transfer',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-2',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      balance: 12000,
    })
  })

  it('should not get another customer balance', async () => {
    inMemoryTransactionsRepository.items.push(
      makeTransaction({
        customerId: new UniqueEntityID('customer-2'),
        priceInCents: 5000,
        type: 'income',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        recipientId: new UniqueEntityID('customer-2'),
        priceInCents: 2000,
        type: 'transfer',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        priceInCents: 10000,
        type: 'income',
      }),
      makeTransaction({
        customerId: new UniqueEntityID('customer-1'),
        recipientId: new UniqueEntityID('customer-2'),
        priceInCents: 3000,
        type: 'reverse',
      }),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      balance: 11000,
    })
  })
})
