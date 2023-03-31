import { compare } from 'bcryptjs'
import { IUserRepository } from '../repositories/users-repository'
import { InvalidCredentials } from './errors/invalid-credential'
import { User } from '@prisma/client'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class Authenticate {
  constructor(private usersRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentials()
    }

    return { user }
  }
}
