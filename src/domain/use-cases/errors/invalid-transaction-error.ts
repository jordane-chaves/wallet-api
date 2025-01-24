import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidTransactionError extends Error implements UseCaseError {
  constructor() {
    super('Invalid transaction.')
  }
}
