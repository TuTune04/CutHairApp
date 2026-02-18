import { Router } from "express";
import { requireAdminApiKey } from "../middlewares/admin-api-key.middleware";
import {
  createExternalRevenueController,
  listDailyRevenueController,
  listMonthlyRevenueController
} from "../controllers/revenue.controller";

export const revenueRouter = Router();

revenueRouter.post("/external-revenues", requireAdminApiKey, createExternalRevenueController);
revenueRouter.get("/revenues/daily", requireAdminApiKey, listDailyRevenueController);
revenueRouter.get("/revenues/monthly", requireAdminApiKey, listMonthlyRevenueController);
