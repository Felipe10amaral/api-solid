import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { Authenticate } from '../authenticate.user'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUserRepository()
  const authenticateUseCase = new Authenticate(prismaUsersRepository)

  return authenticateUseCase
}
