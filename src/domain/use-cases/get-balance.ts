import { Either, right } from '@/core/either'

import { TransactionsRepository } from '../repositories/transactions-repository'

interface GetBalanceUseCaseRequest {
  customerId: string
}

type GetBalanceUseCaseResponse = Either<
  null,
  {
    balance: number
  }
>

export class GetBalanceUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: GetBalanceUseCaseRequest,
  ): Promise<GetBalanceUseCaseResponse> {
    const { customerId } = request

    const balance =
      await this.transactionsRepository.calculateBalanceByCustomerId(customerId)

    return right({
      balance,
    })
  }
}
