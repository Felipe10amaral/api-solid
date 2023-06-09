import { PrismaCheckInRepository } from '../../repositories/prisma/prisma.checkin.repository'
import { ValidateCheckinUseCase } from '../validate.checkin'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new ValidateCheckinUseCase(checkInsRepository)

  return useCase
}
