import { PrismaCheckInRepository } from '../../repositories/prisma/prisma.checkin.repository'
import { FetchUserCheckinHistory } from '../fetch.users.checkin.history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const useCase = new FetchUserCheckinHistory(checkInsRepository)

  return useCase
}
