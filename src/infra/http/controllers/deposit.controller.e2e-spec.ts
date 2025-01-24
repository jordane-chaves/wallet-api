import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'

describe('Deposit (E2E)', () => {
  let app: INestApplication
  let customerFactory: CustomerFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = app.get(CustomerFactory)
    jwt = app.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /transactions', async () => {
    const customer = await customerFactory.makePrismaCustomer({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: customer.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        priceInCents: 10000,
      })

    expect(response.statusCode).toBe(201)

    const transactionOnDatabase = await prisma.transaction.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
    })

    expect(transactionOnDatabase).toEqual(
      expect.objectContaining({
        priceInCents: 10000,
        type: 'INCOME',
      }),
    )
  })
})
