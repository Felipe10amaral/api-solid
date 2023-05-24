import { CheckIn, Prisma } from '@prisma/client'

export interface ICheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>
}
