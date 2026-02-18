export class ApiRequestError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message)
    this.name = "ApiRequestError"
    this.status = options?.status ?? 0
    this.code = options?.code
    this.details = options?.details
  }
}

interface ApiErrorPayload {
  message?: string
  errorCode?: string
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
  errors?: {
    fieldErrors?: Record<string, string[]>
  }
}

export async function parseApiError(response: Response): Promise<ApiRequestError> {
  let message = "Request failed"
  let code: string | undefined
  let details: unknown

  try {
    const payload = (await response.json()) as ApiErrorPayload
    if (payload.error?.message) {
      message = payload.error.message
    } else if (payload.message) {
      message = payload.message
    }
    code = payload.error?.code ?? payload.errorCode
    details = payload.error?.details

    const firstFieldError = Object.values(payload.errors?.fieldErrors ?? {})
      .flat()
      .find(Boolean)
    if (firstFieldError) {
      message = `${message}: ${firstFieldError}`
    }
  } catch {
    message = `${response.status} ${response.statusText}`
  }

  return new ApiRequestError(message, { status: response.status, code, details })
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError
}
