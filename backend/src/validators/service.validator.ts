import { z } from "zod";

export const updateServiceSchema = z.object({
  name: z.string().trim().min(2).optional(),
  category: z.enum(["Dich vu le", "Hoa chat", "Phuc hoi"]).optional(),
  priceText: z.string().trim().min(1).optional(),
  basePriceAmount: z.number().int().nonnegative().optional(),
  defaultDurationMinutes: z.number().int().positive().max(480).optional()
});

export const createServiceSchema = z.object({
  id: z.string().trim().min(2),
  name: z.string().trim().min(2),
  category: z.enum(["Dich vu le", "Hoa chat", "Phuc hoi"]),
  priceText: z.string().trim().min(1),
  basePriceAmount: z.number().int().nonnegative(),
  defaultDurationMinutes: z.number().int().positive().max(480)
});
