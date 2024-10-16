import UserRepository from "@src/application/user/user-repository";
import User from "@src/domain/user";
import {AuthServerRegisterResponse} from "@shared/auth-server-register";

export default class RegisterUser {

  constructor(private userRepository: UserRepository) {
  }

  async execute(email: string, password: string): Promise<User> {
    if (!this.isValidEmail(email))
      throw new RegisterUserError('invalid_email');

    const user = this.userRepository.findByEmail(email);

    if (user)
      throw new RegisterUserError('account_already_exists');

    return this.userRepository.create(email, password);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class RegisterUserError extends Error {
  constructor(message: AuthServerRegisterResponse['message']) {
    super(message);
    this.name = 'RegisterUserError';
  }
}