import { CheckIn, Prisma } from '@prisma/client'

export interface ICheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>
  findById(id: string): Promise<CheckIn | null>
  countByUserId(userId: string): Promise<number>
  save(checkIn: CheckIn): Promise<CheckIn>
}
