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

describe('Transfer (E2E)', () => {
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

  test('[POST] /recipients/:recipientId/transfer', async () => {
    const customer1 = await customerFactory.makePrismaCustomer({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    const customer2 = await customerFactory.makePrismaCustomer({
      email: 'jane@example.com',
      password: await hash('123456', 8),
    })

    await transactionFactory.makePrismaTransaction({
      customerId: customer1.id,
      priceInCents: 50000,
      type: 'income',
    })

    const accessToken = jwt.sign({ sub: customer1.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/recipients/${customer2.id.toString()}/transfer`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        priceInCents: 10000,
      })

    expect(response.statusCode).toBe(201)

    const transactionOnDatabase = await prisma.transaction.findFirst({
      where: {
        customerId: customer1.id.toString(),
        type: 'TRANSFER',
      },
    })

    expect(transactionOnDatabase).toEqual(
      expect.objectContaining({
        customerId: customer1.id.toString(),
        recipientId: customer2.id.toString(),
        priceInCents: 10000,
        type: 'TRANSFER',
      }),
    )
  })
})
