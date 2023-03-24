import { hash } from 'bcryptjs'
import { IUserRepository } from '../repositories/users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 3)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('email already exists')
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
