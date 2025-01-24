import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/entities/customer'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaUser): Customer {
    return Customer.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.UserUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      email: customer.email,
      name: customer.name,
      password: customer.password,
    }
  }
}
