import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ReverseTransactionUseCase } from '@/domain/use-cases/reverse-transaction'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/transactions/:transactionId/reverse')
export class ReverseTransactionController {
  constructor(private reverseTransaction: ReverseTransactionUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('transactionId') transactionId: string,
  ) {
    const userId = user.sub

    const result = await this.reverseTransaction.execute({
      customerId: userId,
      transactionId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
