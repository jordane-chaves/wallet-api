import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Transaction } from '../entities/transaction'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { CannotTransferYourselfError } from './errors/cannot-transfer-yourself-error'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'

interface DepositUseCaseRequest {
  customerId: string
  priceInCents: number
}

type DepositUseCaseResponse = Either<
  CannotTransferYourselfError | InsufficientBalanceError,
  {
    transaction: Transaction
  }
>

@Injectable()
export class DepositUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: DepositUseCaseRequest,
  ): Promise<DepositUseCaseResponse> {
    const { customerId, priceInCents } = request

    const transaction = Transaction.create({
      customerId: new UniqueEntityID(customerId),
      priceInCents,
      type: 'income',
    })

    await this.transactionsRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
