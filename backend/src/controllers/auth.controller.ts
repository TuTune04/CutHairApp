import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../errors";
import { fail, fromAppError, ok } from "../http";
import { loginAdminAccount } from "../services/admin-auth.service";

const loginAdminSchema = z.object({
  username: z.string().trim().min(1, "username is required"),
  password: z.string().min(1, "password is required")
});

export function loginAdminController(req: Request, res: Response): Response {
  const parsed = loginAdminSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }

  try {
    const session = loginAdminAccount(parsed.data.username, parsed.data.password);
    return ok(res, {
      accessToken: session.accessToken,
      tokenType: "Bearer",
      expiresInSeconds: session.expiresInSeconds
    });
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to authenticate admin account");
  }
}
