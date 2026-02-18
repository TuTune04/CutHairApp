import { Router } from "express";
import { requireAdminApiKey } from "../middlewares/admin-api-key.middleware";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAppointmentController,
  listAppointmentsController,
  updateAppointmentController
} from "../controllers/appointments.controller";

export const appointmentsRouter = Router();

appointmentsRouter.post("/", createAppointmentController);
appointmentsRouter.get("/", requireAdminApiKey, listAppointmentsController);
appointmentsRouter.get("/:id", requireAdminApiKey, getAppointmentController);
appointmentsRouter.patch("/:id", requireAdminApiKey, updateAppointmentController);
appointmentsRouter.delete("/:id", requireAdminApiKey, deleteAppointmentController);
