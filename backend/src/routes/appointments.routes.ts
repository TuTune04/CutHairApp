import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAppointmentController,
  listAppointmentsController,
  updateAppointmentController
} from "../controllers/appointments.controller";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", listAppointmentsController);
appointmentsRouter.get("/:id", getAppointmentController);
appointmentsRouter.post("/", createAppointmentController);
appointmentsRouter.patch("/:id", updateAppointmentController);
appointmentsRouter.delete("/:id", deleteAppointmentController);
