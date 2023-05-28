import { CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../repositories/checkin.repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckinUseCaseRequest {
  checkinId: string
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckinUseCase {
  constructor(private checkinsRepository: ICheckinsRepository) {}

  async execute({
    checkinId,
  }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkinId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkinsRepository.save(checkIn)

    return { checkIn }
  }
}
