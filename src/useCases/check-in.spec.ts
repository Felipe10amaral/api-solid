import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckinRepository } from '../repositories/in-memory/in-memory-checkin-repository'
import { CheckinUseCase } from './checkin'

let checkInsRepository: InMemoryCheckinRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinRepository()
    sut = new CheckinUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
