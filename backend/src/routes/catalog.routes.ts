import { Router } from "express";
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
catalogRouter.post("/services", createServiceController);
catalogRouter.patch("/services/:id", updateServiceController);
catalogRouter.delete("/services/:id", deleteServiceController);
