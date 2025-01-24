import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'
import { TransactionFactory } from '@/test/factories/make-transaction'

describe('Reverse Transaction (E2E)', () => {
  let app: INestApplication
  let customerFactory: CustomerFactory
  let transactionFactory: TransactionFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, TransactionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = app.get(CustomerFactory)
    transactionFactory = app.get(TransactionFactory)
    jwt = app.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /transactions/:transactionId/reverse', async () => {
    const customer1 = await customerFactory.makePrismaCustomer({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    const customer2 = await customerFactory.makePrismaCustomer({
      email: 'jane@example.com',
      password: await hash('123456', 8),
    })

    const transaction = await transactionFactory.makePrismaTransaction({
      customerId: customer1.id,
      recipientId: customer2.id,
      priceInCents: 10000,
      type: 'transfer',
    })

    const accessToken = jwt.sign({ sub: customer2.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/transactions/${transaction.id.toString()}/reverse`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const transactionOnDatabase = await prisma.transaction.findFirst({
      where: {
        id: transaction.id.toString(),
      },
    })

    expect(transactionOnDatabase).toEqual(
      expect.objectContaining({
        id: transaction.id.toString(),
        customerId: customer1.id.toString(),
        recipientId: customer2.id.toString(),
        type: 'REVERSE',
      }),
    )
  })
})
