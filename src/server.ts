import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0', // vai fazer com que nossa aplicação mais pra frente seja acessível por frontend que estejam
    // consumindo essa aplicação, isso faz com que evita alguns problemas nessa integração
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
