import { Gym } from '@prisma/client'
import { IGymsRepository } from '../repositories/prisma/gyms.repository'

interface FeatchNearbyGymUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FeatchNearbyGymUseCaseResponse {
  gyms: Gym[]
}

export class FeatchNearbyGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FeatchNearbyGymUseCaseRequest): Promise<FeatchNearbyGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
