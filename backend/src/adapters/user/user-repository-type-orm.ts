import UserRepository from "@src/application/user/user-repository";
import User from "@src/domain/user";
import {DataSource, Repository} from "typeorm";
import {UserEntity} from "@src/adapters/user/user-entity";

export class UserRepositoryTypeOrm implements UserRepository {
  private userRepository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<User | undefined> {
    return (await this.userRepository.findOneBy({id}))?.toUser();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return (await this.userRepository.findOneBy({email: email}))?.toUser();
  }

  async create(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return await this.userRepository.save(user);
  }
}