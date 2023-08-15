import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .status(201)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // HTTPs (o frontend não vai conseguir ler o valor desse cookie como um valor primitivo(ex: string))
      sameSite: true,
      httpOnly: true,
    })
    .send({
      token,
    })
}
