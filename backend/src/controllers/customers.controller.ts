import type { Request, Response } from "express";
import { customerAnalyticsService } from "../container";
import { ok } from "../http";

export function listCustomersController(_req: Request, res: Response): Response {
  return ok(res, customerAnalyticsService.listCustomers());
}
