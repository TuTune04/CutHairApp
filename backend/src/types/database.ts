import { Appointment } from "./appointment";
import { ServiceItem } from "./service";

export interface BookingDatabase {
  services: ServiceItem[];
  appointments: Appointment[];
}
