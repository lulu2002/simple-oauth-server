import bcrypt from "bcrypt";
import PasswordHashing from "@src/application/hashing/password-hashing";

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