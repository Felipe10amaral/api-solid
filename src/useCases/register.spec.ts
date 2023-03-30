import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryRepository } from '../repositories/in-memory/in-memory-use-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-email'

describe('Register Use Case', () => {
  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Felipe',
      email: 'felipe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'tufaodev@email.com'

    await registerUseCase.execute({
      name: 'felipe',
      email,
      password: '123465',
    })

    await expect(() => {
      registerUseCase.execute({
        name: 'felipe',
        email,
        password: '123465',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
