import cors from "cors";
import express from "express";
import { z } from "zod";
import {
  createService,
  createAppointment,
  createExternalRevenue,
  deleteService,
  deleteAppointment,
  getAppointmentById,
  getAvailabilityByDate,
  getServiceById,
  listAppointments,
  listServiceCategories,
  listCustomers,
  listDailyRevenue,
  listMonthlyRevenue,
  listServices,
  updateAppointment,
  updateService
} from "./booking-service";
import { AppError } from "./errors";
import { created as createdResponse, fail, fromAppError, ok } from "./http";
import { ServiceCategory, TimeSlot } from "./types/index";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createAppointmentSchema = z.object({
  customerName: z.string().trim().min(2, "customerName is required"),
  phoneNumber: z.string().trim().min(8, "phoneNumber is required"),
  serviceName: z.string().trim().min(2, "serviceName is required"),
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
  startTime: z.string().regex(timeRegex, "startTime must be HH:MM"),
  durationMinutes: z.number().int().positive().max(240).optional(),
  source: z.enum(["app", "external"]).optional(),
  revenueAmount: z.number().int().nonnegative().optional(),
  notes: z.string().trim().max(300).optional()
});

const updateAppointmentSchema = createAppointmentSchema.partial();

const createExternalRevenueSchema = z.object({
  customerName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(8, "phoneNumber is required"),
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD"),
  serviceNames: z.array(z.string().trim().min(2)).min(1, "at least one service is required"),
  totalRevenue: z.number().int().nonnegative().optional(),
  notes: z.string().trim().max(300).optional()
});

const updateServiceSchema = z.object({
  name: z.string().trim().min(2).optional(),
  category: z.enum(["Dich vu le", "Hoa chat", "Phuc hoi"]).optional(),
  priceText: z.string().trim().min(1).optional(),
  basePriceAmount: z.number().int().nonnegative().optional(),
  defaultDurationMinutes: z.number().int().positive().max(480).optional()
});

const createServiceSchema = z.object({
  id: z.string().trim().min(2),
  name: z.string().trim().min(2),
  category: z.enum(["Dich vu le", "Hoa chat", "Phuc hoi"]),
  priceText: z.string().trim().min(1),
  basePriceAmount: z.number().int().nonnegative(),
  defaultDurationMinutes: z.number().int().positive().max(480)
});

app.get("/health", (_req, res) => {
  return ok(res, {
    status: "ok",
    service: "booking-backend",
    now: new Date().toISOString()
  });
});

app.get("/appointments", (_req, res) => {
  return ok(res, listAppointments());
});

app.get("/appointments/:id", (req, res) => {
  try {
    return ok(res, getAppointmentById(req.params.id));
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to fetch appointment");
  }
});

app.get("/services", (_req, res) => {
  return ok(res, listServices());
});

app.get("/catalog/categories", (_req, res) => {
  return ok(res, listServiceCategories());
});

app.get("/catalog/services", (req, res) => {
  const category = req.query.category ? String(req.query.category) : undefined;
  if (category && !["Dich vu le", "Hoa chat", "Phuc hoi"].includes(category)) {
    return fail(res, 400, "VALIDATION_ERROR", "category is invalid");
  }
  return ok(res, listServices(category as ServiceCategory | undefined));
});

app.get("/catalog/services/:id", (req, res) => {
  try {
    return ok(res, getServiceById(req.params.id));
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to fetch service");
  }
});

app.patch("/catalog/services/:id", (req, res) => {
  const parsed = updateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    return ok(res, updateService(req.params.id, parsed.data));
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to update service");
  }
});

app.post("/catalog/services", (req, res) => {
  const parsed = createServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    return createdResponse(res, createService(parsed.data));
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create service");
  }
});

app.delete("/catalog/services/:id", (req, res) => {
  try {
    return ok(res, deleteService(req.params.id));
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to delete service");
  }
});

app.get("/customers", (_req, res) => {
  return ok(res, listCustomers());
});

app.get("/revenues/daily", (req, res) => {
  const fromDate = req.query.from ? String(req.query.from) : undefined;
  const toDate = req.query.to ? String(req.query.to) : undefined;

  if (fromDate && !dateRegex.test(fromDate)) {
    return fail(res, 400, "VALIDATION_ERROR", "from must be YYYY-MM-DD");
  }
  if (toDate && !dateRegex.test(toDate)) {
    return fail(res, 400, "VALIDATION_ERROR", "to must be YYYY-MM-DD");
  }

  return ok(res, listDailyRevenue(fromDate, toDate));
});

app.get("/revenues/monthly", (req, res) => {
  const year = req.query.year ? String(req.query.year) : undefined;
  if (year && !/^\d{4}$/.test(year)) {
    return fail(res, 400, "VALIDATION_ERROR", "year must be YYYY");
  }

  return ok(res, listMonthlyRevenue(year));
});

app.get("/availability", (req, res) => {
  const date = String(req.query.date ?? "");
  const durationRaw = req.query.durationMinutes;
  const durationMinutes = durationRaw ? Number(durationRaw) : undefined;

  if (!dateRegex.test(date)) {
    return fail(res, 400, "VALIDATION_ERROR", "date query is required in format YYYY-MM-DD");
  }

  if (durationMinutes !== undefined && (!Number.isInteger(durationMinutes) || durationMinutes <= 0)) {
    return fail(res, 400, "VALIDATION_ERROR", "durationMinutes must be a positive integer");
  }

  return ok(res, {
    date,
    freeSlots: getAvailabilityByDate(date, durationMinutes)
  });
});

app.post("/appointments", (req, res) => {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }

  try {
    const createdAppointment = createAppointment({
      ...parsed.data,
      startTime: parsed.data.startTime as TimeSlot
    });
    return createdResponse(res, createdAppointment);
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create appointment");
  }
});

app.patch("/appointments/:id", (req, res) => {
  const parsed = updateAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  try {
    const updated = updateAppointment(req.params.id, {
      ...parsed.data,
      startTime: parsed.data.startTime as TimeSlot | undefined
    });
    return ok(res, updated);
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to update appointment");
  }
});

app.delete("/appointments/:id", (req, res) => {
  try {
    const removed = deleteAppointment(req.params.id);
    return ok(res, removed);
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to delete appointment");
  }
});

app.post("/external-revenues", (req, res) => {
  const parsed = createExternalRevenueSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }

  try {
    const createdEntry = createExternalRevenue(parsed.data);
    return createdResponse(res, createdEntry);
  } catch (error) {
    if (error instanceof AppError) {
      return fromAppError(res, error);
    }
    return fail(res, 500, "INTERNAL_ERROR", "Unable to create external revenue entry");
  }
});

app.use((_req, res) => {
  return fail(res, 404, "NOT_FOUND", "Route not found");
});

app.listen(port, () => {
  // Keep startup log minimal for local development.
  console.log(`Backend is running at http://localhost:${port}`);
});
