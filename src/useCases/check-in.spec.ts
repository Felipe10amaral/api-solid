import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckinRepository } from '../repositories/in-memory/in-memory-checkin-repository'
import { CheckinUseCase } from './checkin'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory.gymsRepository'
import { Decimal } from '@prisma/client/runtime'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkin'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckinRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      description: 'ssl',
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: '',
      title: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 10, 5))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.0747279,
      userLongitude: -49.488967,
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.0747279,
        userLongitude: -49.488967,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 10, 5))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.0747279,
      userLongitude: -49.488967,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 10, 5))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.0747279,
      userLongitude: -49.488967,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check on distant gym', async () => {
    // vi.setSystemTime(new Date(2023, 0, 20, 8, 10, 5))

    gymsRepository.items.push({
      id: 'gym-02',
      description: 'ssl',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: '',
      title: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27,
        userLongitude: -49,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
