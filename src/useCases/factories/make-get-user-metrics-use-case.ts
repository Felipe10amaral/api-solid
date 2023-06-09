import { PrismaCheckInRepository } from '../../repositories/prisma/prisma.checkin.repository'
import { GetUserMetricsUseCase } from '../get.metrics.users'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}
