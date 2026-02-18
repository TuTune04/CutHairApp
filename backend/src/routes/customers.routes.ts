import { Router } from "express";
import { requireAdminApiKey } from "../middlewares/admin-api-key.middleware";
import { listCustomersController } from "../controllers/customers.controller";

export const customersRouter = Router();

customersRouter.get("/", requireAdminApiKey, listCustomersController);
