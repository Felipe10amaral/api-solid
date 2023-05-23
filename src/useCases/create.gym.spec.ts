import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory.gymsRepository'
import { CreateGymUseCase } from './create.gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('Should hash user password upon registration', async () => {
    const { gym } = await sut.execute({
      title: 'Studio do Corpo',
      description: 'hdfhdf',
      phone: '13231',
      latitude: -28.2092052,
      longitude: -48.6401091,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
