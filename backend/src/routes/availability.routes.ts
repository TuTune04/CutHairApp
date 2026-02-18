import { Router } from "express";
import { listAvailabilityController } from "../controllers/appointments.controller";

export const availabilityRouter = Router();

availabilityRouter.get("/", listAvailabilityController);
