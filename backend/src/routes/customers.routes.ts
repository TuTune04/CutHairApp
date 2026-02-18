import { Router } from "express";
import { listCustomersController } from "../controllers/customers.controller";

export const customersRouter = Router();

customersRouter.get("/", listCustomersController);
