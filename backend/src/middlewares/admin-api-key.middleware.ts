import type { Request, Response, NextFunction } from "express";
import { ADMIN_API_KEY } from "../config";
import { fail } from "../http";
import { isAdminAccessProtected, verifyAdminAccessToken } from "../services/admin-auth.service";

export function requireAdminApiKey(req: Request, res: Response, next: NextFunction): void | Response {
  if (!isAdminAccessProtected()) {
    next();
    return;
  }

  const headerValue = req.header("x-admin-api-key")?.trim();
  if (ADMIN_API_KEY && headerValue === ADMIN_API_KEY) {
    next();
    return;
  }

  const authorization = req.header("authorization")?.trim();
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length).trim();
    if (verifyAdminAccessToken(token)) {
      next();
      return;
    }
  }

  return fail(res, 401, "UNAUTHORIZED", "Admin authorization is missing or invalid");
}
