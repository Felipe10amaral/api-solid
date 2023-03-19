import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3330), // ele pega algum dado independente e converte para alguma coisa, nesse contexto vai ser para um numero
})

// aqui eu estou validando
const _env = envSchema.safeParse(process.env) // process.env é onde as minhas variaveis de ambiente estão e safeParse vai tentar validar as informações
if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('nvalid environment variables') // throw error não vai permitir que aplicação execute
}

export const env = _env.data // se tudo der certo ele passa os dados de _env para env
