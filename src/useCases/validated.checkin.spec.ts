import { InMemoryCheckinRepository } from '../repositories/in-memory/in-memory-checkin-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckinUseCase } from './validate.checkin'

let checkInsRepository: InMemoryCheckinRepository
let sut: ValidateCheckinUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinRepository()
    sut = new ValidateCheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkinId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkinId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the checkin in validate after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(23, 0, 1, 13, 40))

    const twentyOneMinutesInMs = 1000 * 60 * 21

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    vi.advanceTimersByTime(twentyOneMinutesInMs)
    await expect(() =>
      sut.execute({
        checkinId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
