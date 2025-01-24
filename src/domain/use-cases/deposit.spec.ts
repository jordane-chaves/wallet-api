import { InMemoryTransactionsRepository } from '@/test/repositories/in-memory-transactions-repository'

import { DepositUseCase } from './deposit'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: DepositUseCase

describe('Deposit', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new DepositUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to create a new deposit', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
      priceInCents: 5000,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      transaction: inMemoryTransactionsRepository.items[0],
    })

    const balance =
      await inMemoryTransactionsRepository.calculateBalanceByCustomerId(
        'customer-1',
      )

    expect(balance).toEqual(5000)
  })
})
