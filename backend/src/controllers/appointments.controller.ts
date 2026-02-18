import type { Request, Response } from "express";
import { appointmentService } from "../container";
import { AppError } from "../errors";
import { fail, fromAppError, ok, created as createdResponse } from "../http";
import { createAppointmentSchema, updateAppointmentSchema } from "../validators/appointment.validator";
import { isValidDateString } from "../validators/common.validator";
import type { TimeSlot } from "../types";

export function listAppointmentsController(_req: Request, res: Response): Response {
  return ok(res, appointmentService.list());
}

export function getAppointmentController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  try {
    return ok(res, appointmentService.getById(id));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to fetch appointment");
  }
}

export function createAppointmentController(req: Request, res: Response): Response {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }

  try {
    const created = appointmentService.create({
      ...parsed.data,
      startTime: parsed.data.startTime as TimeSlot
    });
    return createdResponse(res, created);
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create appointment");
  }
}

export function updateAppointmentController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  const parsed = updateAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    const updated = appointmentService.update(id, {
      ...parsed.data,
      startTime: parsed.data.startTime as TimeSlot | undefined
    });
    return ok(res, updated);
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to update appointment");
  }
}

export function deleteAppointmentController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  try {
    return ok(res, appointmentService.remove(id));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to delete appointment");
  }
}

export function listAvailabilityController(req: Request, res: Response): Response {
  const date = String(req.query.date ?? "");
  const durationRaw = req.query.durationMinutes;
  const durationMinutes = durationRaw ? Number(durationRaw) : undefined;

  if (!isValidDateString(date)) {
    return fail(res, 400, "VALIDATION_ERROR", "date query is required in format YYYY-MM-DD");
  }

  if (durationMinutes !== undefined && (!Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
    return fail(res, 400, "VALIDATION_ERROR", "durationMinutes must be a positive integer");
  }

  return ok(res, {
    date,
    freeSlots: appointmentService.listAvailability(date, durationMinutes)
  });
}
