import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Transaction } from '../entities/transaction'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { InvalidTransactionError } from './errors/invalid-transaction-error'

interface ReverseTransactionUseCaseRequest {
  customerId: string
  transactionId: string
}

type ReverseTransactionUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTransactionError | NotAllowedError,
  {
    transaction: Transaction
  }
>

@Injectable()
export class ReverseTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: ReverseTransactionUseCaseRequest,
  ): Promise<ReverseTransactionUseCaseResponse> {
    const { customerId, transactionId } = request

    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    if (transaction.type !== 'transfer') {
      return left(new InvalidTransactionError())
    }

    if (transaction.recipientId?.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    transaction.type = 'reverse'

    await this.transactionsRepository.save(transaction)

    return right({
      transaction,
    })
  }
}
