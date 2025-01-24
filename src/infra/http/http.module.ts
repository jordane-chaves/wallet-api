import { Module } from '@nestjs/common'

import { AuthenticateCustomerUseCase } from '@/domain/use-cases/authenticate-customer'
import { DepositUseCase } from '@/domain/use-cases/deposit'
import { GetBalanceUseCase } from '@/domain/use-cases/get-balance'
import { RegisterCustomerUseCase } from '@/domain/use-cases/register-customer'
import { ReverseTransactionUseCase } from '@/domain/use-cases/reverse-transaction'
import { TransferUseCase } from '@/domain/use-cases/transfer'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { DepositController } from './controllers/deposit.controller'
import { GetBalanceController } from './controllers/get-balance.controller'
import { ReverseTransactionController } from './controllers/reverse-transaction.controller'
import { TransferController } from './controllers/transfer.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetBalanceController,
    DepositController,
    ReverseTransactionController,
    TransferController,
  ],
  providers: [
    RegisterCustomerUseCase,
    AuthenticateCustomerUseCase,
    GetBalanceUseCase,
    DepositUseCase,
    ReverseTransactionUseCase,
    TransferUseCase,
  ],
})
export class HttpModule {}
