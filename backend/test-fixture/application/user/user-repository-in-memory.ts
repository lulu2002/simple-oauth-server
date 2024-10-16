import UserRepository from "@src/application/user/user-repository";
import User from "@src/domain/user";
import RandomCodeGeneratorImpl from "@src/application/util/random-code-generator-impl";

export default class UserRepositoryInMemory implements UserRepository {

  private users: User[] = [];

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(email: string, password: string): Promise<User> {
    const user: User = {
      id: new RandomCodeGeneratorImpl().generate(10),
      email: email,
      password: password
    }

    this.users.push(user);
    return user;
  }

}