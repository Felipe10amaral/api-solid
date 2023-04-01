import { expect, describe, it } from 'vitest'
import { InMemoryRepository } from '../repositories/in-memory/in-memory-use-repository'
import { Authenticate } from './authenticate.user'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credential'

describe('Authenticate Use Case', () => {
  it('Should to be able authenticate', async () => {
    const usersRepository = new InMemoryRepository()
    const sut = new Authenticate(usersRepository)

    await usersRepository.create({
      name: 'Tufao',
      email: 'falsh@email.com',
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({
      email: 'falsh@email.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not to be able authenticate with wrong email', async () => {
    const usersRepository = new InMemoryRepository()
    const sut = new Authenticate(usersRepository)

    expect(() =>
      sut.execute({
        email: 'email@email.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('Should not to be able authenticate with wrong password', async () => {
    const usersRepository = new InMemoryRepository()
    const sut = new Authenticate(usersRepository)

    await usersRepository.create({
      name: 'tufao',
      email: 'tufao@email.com',
      password_hash: await hash('12345', 6),
    })

    expect(() =>
      sut.execute({
        email: 'tufao@email.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
