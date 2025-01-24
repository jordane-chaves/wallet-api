import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { TransactionFactory } from '@/test/factories/make-transaction'

describe('Get Balance (E2E)', () => {
  let app: INestApplication
  let customerFactory: CustomerFactory
  let transactionFactory: TransactionFactory
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

    await app.init()
  })

  test('[GET] /balance', async () => {
    const customer1 = await customerFactory.makePrismaCustomer({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    const customer2 = await customerFactory.makePrismaCustomer({
      email: 'jane@example.com',
      password: await hash('123456', 8),
    })

    await Promise.all([
      transactionFactory.makePrismaTransaction({
        customerId: customer1.id,
        type: 'income',
        priceInCents: 5000,
      }),
      transactionFactory.makePrismaTransaction({
        customerId: customer1.id,
        recipientId: customer2.id,
        priceInCents: 2000,
        type: 'transfer',
      }),
      transactionFactory.makePrismaTransaction({
        customerId: customer1.id,
        type: 'income',
        priceInCents: 10000,
      }),
      transactionFactory.makePrismaTransaction({
        customerId: customer1.id,
        recipientId: customer2.id,
        priceInCents: 3000,
        type: 'reverse',
      }),
    ])

    const accessToken1 = jwt.sign({ sub: customer1.id.toString() })

    const response1 = await request(app.getHttpServer())
      .get('/balance')
      .set('Authorization', `Bearer ${accessToken1}`)

    expect(response1.statusCode).toBe(200)
    expect(response1.body).toEqual({
      balance: 16000,
    })

    const accessToken2 = jwt.sign({ sub: customer2.id.toString() })

    const response2 = await request(app.getHttpServer())
      .get('/balance')
      .set('Authorization', `Bearer ${accessToken2}`)

    expect(response2.statusCode).toBe(200)
    expect(response2.body).toEqual({
      balance: 2000,
    })
  })
})
