import User from "@src/domain/user";

export default interface UserRepository {
  findById(id: string): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;

  create(email: string, password: string): Promise<User>;
}