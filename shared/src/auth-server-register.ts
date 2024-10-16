export interface AuthServerRegisterRequest {
  username: string,
  password: string,
}

export interface AuthServerRegisterResponse {
  success: boolean;
  message: "ok" | "account_already_exists" | "invalid_email" | "invalid_password" | "unknown_error",
}