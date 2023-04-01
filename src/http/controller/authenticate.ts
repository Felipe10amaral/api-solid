import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { Authenticate } from '../../useCases/authenticate.user'
import { InvalidCredentials } from '../../useCases/errors/invalid-credential'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUserRepository()
    const authenticateUseCase = new Authenticate(prismaUsersRepository)

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(400).send()
    }

    throw error
  }

  return reply.status(200).send()
}
