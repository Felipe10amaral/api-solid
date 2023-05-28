import { CheckIn, Prisma } from '@prisma/client'
import { ICheckinsRepository } from '../checkin.repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckinRepository implements ICheckinsRepository {
  public items: CheckIn[] = []

  async findByIdOnDate(userId: string, date: Date) {
    const startOfTheDate = dayjs(date).startOf('date')
    const endOfTheDate = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkin) => {
      const checkInDate = dayjs(checkin.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDate) &&
        checkInDate.isBefore(endOfTheDate)

      return checkin.user_id === userId && isOnSameDate
    })

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

  async findManyByUserId(user_id: string, page: number) {
    return this.items
      .filter((item) => item.user_id === user_id)
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const checkin = this.items.find((item) => item.id === id)

    if (!checkin) {
      return null
    }

    return checkin
  }

  async countByUserId(user_id: string) {
    return this.items.filter((item) => item.user_id === user_id).length
  }

  async save(checkIn: CheckIn) {
    const checkinIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkinIndex >= 0) {
      this.items[checkinIndex] = checkIn
    }

    return checkIn
  }
}
