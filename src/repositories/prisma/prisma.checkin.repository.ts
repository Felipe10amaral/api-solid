import { Prisma, CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../checkin.repository'
import { prisma } from '../../lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInRepository implements ICheckinsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = prisma.checkIn.create({
      data,
    })

    return checkin
  }

  async findByIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkin = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    })

    return checkin
  }

  async findManyByUserId(user_id: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        id: user_id,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        id: userId,
      },
    })

    return count
  }

  async save(checkIn: CheckIn) {
    const update = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })

    return update
  }
}
