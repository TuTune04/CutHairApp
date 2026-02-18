import { BookingSource, TimeSlot } from "./common";

export interface Appointment {
  id: string;
  customerName: string;
  phoneNumber: string;
  serviceName: string;
  date: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
  source: BookingSource;
  revenueAmount: number;
  serviceNames?: string[];
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentInput {
  customerName: string;
  phoneNumber: string;
  serviceName: string;
  date: string;
  startTime: TimeSlot;
  durationMinutes?: number;
  source?: BookingSource;
  revenueAmount?: number;
  notes?: string;
}

export interface UpdateAppointmentInput {
  customerName?: string;
  phoneNumber?: string;
  serviceName?: string;
  date?: string;
  startTime?: TimeSlot;
  durationMinutes?: number;
  source?: BookingSource;
  revenueAmount?: number;
  notes?: string;
}

export interface CreateExternalRevenueInput {
  customerName?: string;
  phoneNumber: string;
  date: string;
  serviceNames: string[];
  totalRevenue?: number;
  notes?: string;
}
