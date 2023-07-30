import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '../../../useCases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamsSchema = z.object({
    checkinId: z.string().uuid(),
  })

  const { checkinId } = validateCheckinParamsSchema.parse(request.params)

  const validateUseCase = makeValidateCheckInUseCase()

  await validateUseCase.execute({
    checkinId,
  })

  return reply.status(204).send()
}
