import { CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../repositories/checkin.repository'
import { IGymsRepository } from '../repositories/prisma/gyms.repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '../utils/get.distance.between.coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkin'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(
    private checkinsRepository: ICheckinsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkinOnSameDay = await this.checkinsRepository.findByIdOnDate(
      userId,
      new Date(),
    )

    if (checkinOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
