import { PrismaCheckInRepository } from '../../repositories/prisma/prisma.checkin.repository'
import { PrismaGymsRepository } from '../../repositories/prisma/prisma.gyms.repository'
import { CheckinUseCase } from '../checkin'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const gymsRepository = new PrismaGymsRepository()

  const useCase = new CheckinUseCase(checkInsRepository, gymsRepository)

  return useCase
}
