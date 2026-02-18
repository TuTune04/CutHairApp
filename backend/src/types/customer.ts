import { BookingSource, TimeSlot } from "./common";

export interface CustomerBookingHistoryItem {
  appointmentId: string;
  serviceName: string;
  serviceNames?: string[];
  date: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
  source: BookingSource;
  revenueAmount: number;
  createdAt: string;
}

export interface CustomerSummary {
  customerName: string;
  phoneNumber: string;
  totalAppointments: number;
  latestAppointmentAt: string;
  servicesUsed: string[];
  bookingHistory: CustomerBookingHistoryItem[];
}
