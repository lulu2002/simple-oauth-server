export interface RegisterAccountResult {
  success: boolean,
  reason: "ok" | "account_already_exists" | "invalid_email" | "invalid_password" | "unknown_error",
}

export interface RegisterAccountContext {
  email: string,
  password: string,
}