import type { ApiClient } from "./client"

export interface AdminLoginPayload {
  username: string
  password: string
}

export interface AdminLoginResult {
  accessToken: string
  tokenType: "Bearer"
  expiresInSeconds: number
}

export async function postAdminLogin(client: ApiClient, body: AdminLoginPayload): Promise<AdminLoginResult> {
  const payload = await client.post<{ data: AdminLoginResult }>("/auth/admin/login", body)
  return payload.data
}
