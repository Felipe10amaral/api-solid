import { PrismaGymsRepository } from '../../repositories/prisma/prisma.gyms.repository'
import { FeatchNearbyGymUseCase } from '../featch.nearby.gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FeatchNearbyGymUseCase(gymsRepository)

  return useCase
}
