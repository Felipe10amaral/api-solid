import fastify from 'fastify'
import { gymsRoutes } from './http/controller/gyms/routes'
import { usersRoutes } from './http/controller/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { checkinsRoutes } from './http/controller/checkins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(gymsRoutes)
app.register(usersRoutes)
app.register(checkinsRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'validation error', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    console.error(error)
  } else {
    // ferramentas que de observalidade ex: Datadog
  }

  return reply.status(500).send({ message: 'internal error server' })
})
