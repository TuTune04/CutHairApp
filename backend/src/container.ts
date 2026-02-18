import { FileDatabaseRepository, JsonAppointmentRepository, JsonServiceRepository } from "./repositories/database.repository";
import { AppointmentService } from "./services/appointment.service";
import { CatalogService } from "./services/catalog.service";
import { CustomerAnalyticsService } from "./services/customer-analytics.service";
import { RevenueAnalyticsService } from "./services/revenue-analytics.service";

const databaseRepository = new FileDatabaseRepository();
const appointmentRepository = new JsonAppointmentRepository(databaseRepository);
const serviceRepository = new JsonServiceRepository(databaseRepository);

export const catalogService = new CatalogService(serviceRepository);
export const appointmentService = new AppointmentService(appointmentRepository, catalogService);
export const customerAnalyticsService = new CustomerAnalyticsService(appointmentRepository);
export const revenueAnalyticsService = new RevenueAnalyticsService(appointmentRepository);
