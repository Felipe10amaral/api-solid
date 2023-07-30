import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '../../../useCases/factories/make.checkin.useCase'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckinParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckinBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckinBodySchema.parse(request.body)
  const { gymId } = createCheckinParamsSchema.parse(request.params)

  const checkinUseCase = makeCheckInUseCase()

  await checkinUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
