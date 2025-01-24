import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer, CustomerProps } from '@/domain/entities/customer'

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
