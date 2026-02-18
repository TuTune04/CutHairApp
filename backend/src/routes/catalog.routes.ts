import { Router } from "express";
import { requireAdminApiKey } from "../middlewares/admin-api-key.middleware";
import {
  createServiceController,
  deleteServiceController,
  getServiceController,
  listCategoriesController,
  listServicesController,
  updateServiceController
} from "../controllers/catalog.controller";

export const catalogRouter = Router();

catalogRouter.get("/categories", listCategoriesController);
catalogRouter.get("/services", listServicesController);
catalogRouter.get("/services/:id", getServiceController);
catalogRouter.post("/services", requireAdminApiKey, createServiceController);
catalogRouter.patch("/services/:id", requireAdminApiKey, updateServiceController);
catalogRouter.delete("/services/:id", requireAdminApiKey, deleteServiceController);
