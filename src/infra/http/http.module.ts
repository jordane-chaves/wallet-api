import { Module } from '@nestjs/common'

import { AuthenticateCustomerUseCase } from '@/domain/use-cases/authenticate-customer'
import { RegisterCustomerUseCase } from '@/domain/use-cases/register-customer'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [RegisterCustomerUseCase, AuthenticateCustomerUseCase],
})
export class HttpModule {}
