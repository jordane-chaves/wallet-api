import { BadRequestException, Controller, Get } from '@nestjs/common'

import { GetBalanceUseCase } from '@/domain/use-cases/get-balance'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/balance')
export class GetBalanceController {
  constructor(private getBalance: GetBalanceUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getBalance.execute({
      customerId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { balance } = result.value

    return {
      balance,
    }
  }
}
