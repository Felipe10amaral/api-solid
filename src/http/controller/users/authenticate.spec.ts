import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'felipe Amaral',
      email: 'felipe@email.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'felipe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
