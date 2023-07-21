import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentials } from '../../useCases/errors/invalid-credential'
import { makeAuthenticateUseCase } from '../../useCases/factories/make.authenticate.useCase'

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
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({
      token,
    })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(400).send()
    }

    throw error
  }
}
