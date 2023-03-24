import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { PrismaUserRepository } from '../repositories/prisma-user-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCases({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 3)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('email already exists')
  }

  const prismaUserRepository = new PrismaUserRepository()

  await prismaUserRepository.create({
    name,
    email,
    password_hash,
  })
}
