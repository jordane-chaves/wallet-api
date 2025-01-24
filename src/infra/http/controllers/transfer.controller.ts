import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { TransferUseCase } from '@/domain/use-cases/transfer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const transferBodySchema = z.object({
  priceInCents: z.number().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(transferBodySchema)

type TransferBodySchema = z.infer<typeof transferBodySchema>

@Controller('/recipients/:recipientId/transfer')
export class TransferController {
  constructor(private transfer: TransferUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: TransferBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('recipientId') recipientId: string,
  ) {
    const userId = user.sub
    const { priceInCents } = body

    const result = await this.transfer.execute({
      customerId: userId,
      recipientId,
      priceInCents,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }
  }
}
