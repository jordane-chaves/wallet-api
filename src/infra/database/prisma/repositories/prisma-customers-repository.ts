import { Injectable } from '@nestjs/common'

import { Customer } from '@/domain/entities/customer'
import { CustomersRepository } from '@/domain/repositories/customers-repository'

import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.user.create({
      data,
    })
  }
}
