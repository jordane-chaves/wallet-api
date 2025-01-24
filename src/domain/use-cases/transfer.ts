import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Transaction } from '../entities/transaction'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { CannotTransferYourselfError } from './errors/cannot-transfer-yourself-error'
import { InsufficientBalanceError } from './errors/insufficient-balance-error'

interface TransferUseCaseRequest {
  customerId: string
  recipientId: string
  priceInCents: number
}

type TransferUseCaseResponse = Either<
  CannotTransferYourselfError | InsufficientBalanceError,
  {
    transaction: Transaction
  }
>

export class TransferUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: TransferUseCaseRequest,
  ): Promise<TransferUseCaseResponse> {
    const { customerId, recipientId, priceInCents } = request

    if (customerId === recipientId) {
      return left(new CannotTransferYourselfError())
    }

    const balance =
      await this.transactionsRepository.calculateBalanceByCustomerId(customerId)

    if (balance < priceInCents) {
      return left(new InsufficientBalanceError())
    }

    const transaction = Transaction.create({
      customerId: new UniqueEntityID(customerId),
      recipientId: new UniqueEntityID(recipientId),
      priceInCents,
      type: 'transfer',
    })

    await this.transactionsRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
