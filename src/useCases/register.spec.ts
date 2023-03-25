import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository'

describe('Register Use Case', () => {
  it('Should hash user password upon registration', async () => {
    const prismaUserRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(prismaUserRepository)

    const { user } = await registerUseCase.execute({
      name: 'Felipe',
      email: 'feli@email.com',
      password: '12346',
    })

    console.log(user.password_hash)

    const isPasswordCorrectlyHashed = await compare(
      '123465',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
