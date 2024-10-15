export interface AuthServerLoginRequest {
    username: string;
    password: string;
    client_id: string;
    redirect_uri: string;
}
export interface AuthServerLoginResponse {
    success: boolean;
    message: string;
    token: string;
}
//# sourceMappingURL=auth-server-login.d.ts.map