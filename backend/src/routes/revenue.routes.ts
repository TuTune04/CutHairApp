import { Router } from "express";
import {
  createExternalRevenueController,
  listDailyRevenueController,
  listMonthlyRevenueController
} from "../controllers/revenue.controller";

export const revenueRouter = Router();

revenueRouter.post("/external-revenues", createExternalRevenueController);
revenueRouter.get("/revenues/daily", listDailyRevenueController);
revenueRouter.get("/revenues/monthly", listMonthlyRevenueController);
