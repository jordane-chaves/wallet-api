import { Customer } from '../entities/customer'

export interface CustomersRepository {
  findByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
}
