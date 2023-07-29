import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '../../../useCases/factories/make.create.gym.useCase'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymsBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, latitude, longitude, phone } =
    createGymsBodySchema.parse(request.body)

  const createUseCase = makeCreateGymUseCase()

  await createUseCase.execute({
    title,
    description,
    latitude,
    phone,
    longitude,
  })

  return reply.status(201).send()
}
