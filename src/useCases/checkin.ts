import { CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../repositories/checkin.repository'
import { IGymsRepository } from '../repositories/prisma/gyms.repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkinOnSameDay = await this.checkinsRepository.findByIdOnDate(
      userId,
      new Date(),
    )

    if (checkinOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
