import { CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../repositories/checkin.repository'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(private checkinsRepository: ICheckinsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
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
