import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middleware/verify.jwt'
import { create } from './create'
import { metrics } from './metrics'
import { history } from './history'
import { validate } from './validate'
import { verifyUserRole } from '../../middleware/verifyUserRole'

export async function checkinsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/create/:gymId/checkin', create)
  app.patch(
    '/checkins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )

  app.get('/checkins/metrics', metrics)
  app.get('/checkins/history', history)
}
