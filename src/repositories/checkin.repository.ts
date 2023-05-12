import { CheckIn, Prisma } from '@prisma/client'

export interface ICheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
