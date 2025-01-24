import { Module } from '@nestjs/common'

import { CustomersRepository } from '@/domain/repositories/customers-repository'
import { TransactionsRepository } from '@/domain/repositories/transactions-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { PrismaTransactionsRepository } from './prisma/repositories/prisma-transactions-repository'

@Module({
  providers: [
    PrismaService,
    { provide: CustomersRepository, useClass: PrismaCustomersRepository },
    { provide: TransactionsRepository, useClass: PrismaTransactionsRepository },
  ],
  exports: [PrismaService, CustomersRepository, TransactionsRepository],
})
export class DatabaseModule {}
