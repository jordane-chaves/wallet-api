import { Customer } from '../entities/customer'

export abstract class CustomersRepository {
  abstract findByEmail(email: string): Promise<Customer | null>
  abstract create(customer: Customer): Promise<void>
}
