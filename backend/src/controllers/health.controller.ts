import type { Request, Response } from "express";
import { ok } from "../http";

export function healthController(_req: Request, res: Response): Response {
  return ok(res, {
    status: "ok",
    service: "booking-backend",
    now: new Date().toISOString()
  });
}
