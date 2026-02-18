import { Router } from "express";
import { appointmentsRouter } from "./appointments.routes";
import { authRouter } from "./auth.routes";
import { availabilityRouter } from "./availability.routes";
import { catalogRouter } from "./catalog.routes";
import { listServicesController } from "../controllers/catalog.controller";
import { customersRouter } from "./customers.routes";
import { healthRouter } from "./health.routes";
import { revenueRouter } from "./revenue.routes";

export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/appointments", appointmentsRouter);
apiV1Router.use("/customers", customersRouter);
apiV1Router.use("/availability", availabilityRouter);
apiV1Router.use("/catalog", catalogRouter);
apiV1Router.use("/", revenueRouter);

// Keep explicit alias for list services under v1.
apiV1Router.get("/services", listServicesController);
