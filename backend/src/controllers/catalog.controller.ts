import type { Request, Response } from "express";
import { catalogService } from "../container";
import { AppError } from "../errors";
import { created as createdResponse, fail, fromAppError, ok } from "../http";
import { createServiceSchema, updateServiceSchema } from "../validators/service.validator";
import type { ServiceCategory } from "../types";

const VALID_CATEGORIES = ["Dich vu le", "Hoa chat", "Phuc hoi"];

export function listServicesController(req: Request, res: Response): Response {
  const category = req.query.category ? String(req.query.category) : undefined;
  if (category && !VALID_CATEGORIES.includes(category)) {
    return fail(res, 400, "VALIDATION_ERROR", "category is invalid");
  }
  return ok(res, catalogService.list(category as ServiceCategory | undefined));
}

export function listCategoriesController(_req: Request, res: Response): Response {
  return ok(res, catalogService.listCategories());
}

export function getServiceController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  try {
    return ok(res, catalogService.getById(id));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to fetch service");
  }
}

export function createServiceController(req: Request, res: Response): Response {
  const parsed = createServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    return createdResponse(res, catalogService.create(parsed.data));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create service");
  }
}

export function updateServiceController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  const parsed = updateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    return ok(res, catalogService.update(id, parsed.data));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to update service");
  }
}

export function deleteServiceController(req: Request, res: Response): Response {
  const id = String(req.params.id);
  try {
    return ok(res, catalogService.remove(id));
  } catch (error) {
    if (error instanceof AppError) return fromAppError(res, error);
    return fail(res, 500, "INTERNAL_ERROR", "Unable to delete service");
  }
}
