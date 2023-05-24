import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckinRepository } from '../repositories/in-memory/in-memory-checkin-repository'

import { FetchUserCheckinHistory } from './fetch.users.checkin.history'

let checkInsRepository: InMemoryCheckinRepository
let sut: FetchUserCheckinHistory

describe('Fetch Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinRepository()
    sut = new FetchUserCheckinHistory(checkInsRepository)
  })

  it('should be able to fetch check in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
  })

  it('should be able to fetch paginated check in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
