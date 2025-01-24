import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeCustomer } from '@/test/factories/make-customer'
import { InMemoryCustomersRepository } from '@/test/repositories/in-memory-customers-repository'

import { AuthenticateCustomerUseCase } from './authenticate-customer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryCustomersRepository: InMemoryCustomersRepository

let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher

let sut: AuthenticateCustomerUseCase

describe('Authenticate Customer', () => {
  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository()

    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateCustomerUseCase(
      inMemoryCustomersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a customer', async () => {
    const encryptSpy = vi.spyOn(fakeEncrypter, 'encrypt')

    const hashedPassword = await fakeHasher.hash('123456')
    inMemoryCustomersRepository.items.push(
      makeCustomer({ email: 'johndoe@example.com', password: hashedPassword }),
    )

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })

    expect(encryptSpy).toHaveBeenCalled()
  })

  it('should not be able to authenticate non existent customer', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const hashedPassword = await fakeHasher.hash('123456')
    inMemoryCustomersRepository.items.push(
      makeCustomer({ email: 'johndoe@example.com', password: hashedPassword }),
    )

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
