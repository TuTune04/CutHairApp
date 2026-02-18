import { z } from "zod";
import { isValidDateString, dateRegex, timeRegex } from "./common.validator";

export const createAppointmentSchema = z.object({
  customerName: z.string().trim().min(2, "customerName is required"),
  phoneNumber: z.string().trim().min(8, "phoneNumber is required"),
  serviceName: z.string().trim().min(2, "serviceName is required"),
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD").refine(isValidDateString, "date is not a valid calendar day"),
  startTime: z.string().regex(timeRegex, "startTime must be HH:MM"),
  durationMinutes: z.number().int().positive().max(480).optional(),
  source: z.enum(["app", "external"]).optional(),
  revenueAmount: z.number().int().nonnegative().optional(),
  notes: z.string().trim().max(300).optional()
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const createExternalRevenueSchema = z.object({
  customerName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(8, "phoneNumber is required"),
  date: z.string().regex(dateRegex, "date must be YYYY-MM-DD").refine(isValidDateString, "date is not a valid calendar day"),
  serviceNames: z.array(z.string().trim().min(2)).min(1, "at least one service is required"),
  totalRevenue: z.number().int().nonnegative().optional(),
  notes: z.string().trim().max(300).optional()
});
