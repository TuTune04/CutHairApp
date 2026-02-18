export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "SERVICE_NOT_AVAILABLE"
  | "OUTSIDE_WORKING_HOURS"
  | "TIME_SLOT_UNAVAILABLE"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR";

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiErrorBody;
}
