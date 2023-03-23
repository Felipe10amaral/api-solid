import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUseCases } from '../../useCases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCases({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(400).send()
  }

  return reply.status(201).send()
}
