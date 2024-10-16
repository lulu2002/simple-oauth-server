export default interface PasswordHashing {
  hash(password: string): Promise<string>;

  verify(password: string, hashedPassword: string): Promise<boolean>;
}

