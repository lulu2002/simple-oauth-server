import UserRepository from "@src/application/user/user-repository";
import User from "@src/domain/user";

export default class UserRepositoryInMemory implements UserRepository {

  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  create(email: string, password: string): User {
    const user: User = {
      id: this.makeId(10),
      email: email,
      password: password
    }

    this.users.push(user);
    return user;
  }

  private makeId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

}