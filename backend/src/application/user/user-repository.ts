import User from "@domain/user";

export default interface UserRepository {
  findById(id: string): User | undefined;
  findByEmail(email: string): User | undefined;
  create(email: string, password: string): User;
}