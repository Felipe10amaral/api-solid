import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: any) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 3)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('email already exists')
    }

    // const prismaUserRepository = new PrismaUserRepository()

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
