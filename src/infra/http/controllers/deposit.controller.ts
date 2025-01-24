import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { DepositUseCase } from '@/domain/use-cases/deposit'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const depositBodySchema = z.object({
  priceInCents: z.number().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(depositBodySchema)

type DepositBodySchema = z.infer<typeof depositBodySchema>

@Controller('/transactions')
export class DepositController {
  constructor(private deposit: DepositUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: DepositBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const { priceInCents } = body

    const result = await this.deposit.execute({
      customerId: userId,
      priceInCents,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
