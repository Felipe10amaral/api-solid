import { CheckIn } from '@prisma/client'
import { ICheckinsRepository } from '../repositories/checkin.repository'

interface FetchUserCheckinHistoryRequest {
  userId: string
  page: number
}

interface FetchUserCheckinHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckinHistory {
  constructor(private checkinsRepository: ICheckinsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckinHistoryRequest): Promise<FetchUserCheckinHistoryResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
