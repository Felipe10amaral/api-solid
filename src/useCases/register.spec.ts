import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryRepository } from '../repositories/in-memory/in-memory-use-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-email'

let usersRepository: InMemoryRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Felipe',
      email: 'feli@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should to register', async () => {
    const { user } = await sut.execute({
      name: 'Felipe',
      email: 'felipe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'tufaodev@email.com'

    await sut.execute({
      name: 'felipe',
      email,
      password: '123465',
    })

    await expect(() =>
      sut.execute({
        name: 'tamires',
        email,
        password: '123465',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
