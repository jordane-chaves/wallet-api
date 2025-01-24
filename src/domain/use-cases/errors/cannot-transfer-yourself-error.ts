import { UseCaseError } from '@/core/errors/use-case-error'

export class CannotTransferYourselfError extends Error implements UseCaseError {
  constructor() {
    super('Cannot transfer to yourself.')
  }
}
