import { Response } from "express";
import { AppError } from "./errors";
import { ApiErrorCode } from "./types/index";

export function ok<T>(res: Response, data: T, meta?: Record<string, unknown>): Response {
  return res.status(200).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function created<T>(res: Response, data: T): Response {
  return res.status(201).json({ success: true, data });
}

export function fail(
  res: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown
): Response {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    },
    // compatibility with previous frontend parsers
    message,
    errorCode: code
  });
}

export function fromAppError(res: Response, error: AppError): Response {
  return fail(res, error.status, error.code, error.message, error.details);
}
