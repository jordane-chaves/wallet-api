import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer, CustomerProps } from '@/domain/entities/customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
): Customer {
  const customer = Customer.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return customer
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {},
  ): Promise<Customer> {
    const customer = makeCustomer(data)

    await this.prisma.user.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
