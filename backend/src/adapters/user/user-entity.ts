import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import User from "@src/domain/user";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('identity')
  id!: string;

  @Column({unique: true, type: 'varchar'})
  email!: string;

  @Column('varchar')
  password!: string;

  toUser(): User {
    return {
      id: this.id,
      email: this.email,
      password: this.password
    }
  }
}


export function toUserEntity(user: User): UserEntity {
  const entity = new UserEntity();
  entity.id = user.id;
  entity.email = user.email;
  entity.password = user.password;
  return entity;
}