export interface RegisterAccountResult {
  success: boolean,
  reason: string
}

export interface RegisterAccountContext {
  email: string,
  password: string,
}