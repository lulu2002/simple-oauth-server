import PasswordHashing from "@src/application/hashing/PasswordHashing";
import bcrypt from "bcrypt";

export default class PasswordHashingImpl implements PasswordHashing {

  constructor(private saltRounds: number) {
  }

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

}