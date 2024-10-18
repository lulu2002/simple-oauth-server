import PasswordHashing from "@src/application/hashing/password-hashing";

export default class PasswordHashingNoHashing implements PasswordHashing {
  hash(password: string): Promise<string> {
    return Promise.resolve(password);
  }

  verify(password: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(password === hashedPassword);
  }
}