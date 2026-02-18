import type { Request, Response } from "express";
import { appointmentService, revenueAnalyticsService } from "../container";
import { AppError } from "../errors";
import { created as createdResponse, fail, fromAppError, ok } from "../http";
import { createExternalRevenueSchema } from "../validators/appointment.validator";
import { isValidDateString } from "../validators/common.validator";

export function listDailyRevenueController(req: Request, res: Response): Response {
  const fromDate = req.query.from ? String(req.query.from) : undefined;
  const toDate = req.query.to ? String(req.query.to) : undefined;

  if (fromDate && !isValidDateString(fromDate)) {
    return fail(res, 400, "VALIDATION_ERROR", "from must be YYYY-MM-DD");
  }
  if (toDate && !isValidDateString(toDate)) {
    return fail(res, 400, "VALIDATION_ERROR", "to must be YYYY-MM-DD");
  }

  return ok(res, revenueAnalyticsService.listDaily(fromDate, toDate));
}

export function listMonthlyRevenueController(req: Request, res: Response): Response {
  const year = req.query.year ? String(req.query.year) : undefined;
  if (year && !/^\d{4}$/.test(year)) {
    return fail(res, 400, "VALIDATION_ERROR", "year must be YYYY");
  }
  return ok(res, revenueAnalyticsService.listMonthly(year));
}

export function createExternalRevenueController(req: Request, res: Response): Response {
  const parsed = createExternalRevenueSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    return createdResponse(res, appointmentService.createExternalRevenue(parsed.data));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create external revenue entry");
  }
}
