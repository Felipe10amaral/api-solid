import { CheckIn, Prisma } from '@prisma/client'
import { ICheckinsRepository } from '../checkin.repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckinRepository implements ICheckinsRepository {
  public items: CheckIn[] = []

  async findByIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find(
      (checkin) => checkin.user_id === userId,
    )

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
