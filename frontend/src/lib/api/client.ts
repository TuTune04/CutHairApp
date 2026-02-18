import { parseApiError } from "../api-errors";

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  if (trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json() as Promise<T>;
}

export function createApiClient(baseUrl: string): ApiClient {
  const apiBaseUrl = normalizeApiBaseUrl(baseUrl);

  return {
    async get<T>(path: string): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
      return readJsonResponse<T>(response);
    },
    async post<T>(path: string, body: unknown): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      return readJsonResponse<T>(response);
    },
    async patch<T>(path: string, body: unknown): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      return readJsonResponse<T>(response);
    },
    async delete<T>(path: string): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "DELETE"
      });
      return readJsonResponse<T>(response);
    }
  };
}
