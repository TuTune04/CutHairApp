import { parseApiError } from "../api-errors";

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

export interface ApiClientOptions {
  adminApiKey?: string;
  adminAccessToken?: string;
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

export function createApiClient(baseUrl: string, options?: ApiClientOptions): ApiClient {
  const apiBaseUrl = normalizeApiBaseUrl(baseUrl);
  const adminApiKey = options?.adminApiKey?.trim();
  const adminAccessToken = options?.adminAccessToken?.trim();

  function withAuthHeaders(headers?: Record<string, string>): Record<string, string> {
    const next = { ...(headers ?? {}) };
    if (adminApiKey) {
      next["x-admin-api-key"] = adminApiKey;
    }
    if (adminAccessToken) {
      next.Authorization = `Bearer ${adminAccessToken}`;
    }
    return next;
  }

  return {
    async get<T>(path: string): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        cache: "no-store",
        headers: withAuthHeaders()
      });
      return readJsonResponse<T>(response);
    },
    async post<T>(path: string, body: unknown): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "POST",
        headers: withAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body)
      });
      return readJsonResponse<T>(response);
    },
    async patch<T>(path: string, body: unknown): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "PATCH",
        headers: withAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body)
      });
      return readJsonResponse<T>(response);
    },
    async delete<T>(path: string): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "DELETE",
        headers: withAuthHeaders()
      });
      return readJsonResponse<T>(response);
    }
  };
}
