import type { Appointment, CustomerSummary } from "../types";
import type { AppointmentRepository } from "../repositories/database.repository";
import { normalizePhoneNumber } from "../utils/phone.utils";
import { compareDateTime } from "../utils/time.utils";

export function buildCustomerSummaries(appointments: Appointment[]): CustomerSummary[] {
  const grouped = new Map<string, CustomerSummary>();

  for (const item of appointments) {
    const key = normalizePhoneNumber(item.phoneNumber);
    const candidateAt = new Date(`${item.date}T${item.startTime}:00`).toISOString();
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        customerName: item.customerName,
        phoneNumber: item.phoneNumber,
        totalAppointments: 1,
        latestAppointmentAt: candidateAt,
        servicesUsed: [...new Set(item.serviceNames ?? [item.serviceName])],
        bookingHistory: [
          {
            appointmentId: item.id,
            serviceName: item.serviceName,
            serviceNames: item.serviceNames,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            source: item.source,
            revenueAmount: item.revenueAmount,
            createdAt: item.createdAt
          }
        ]
      });
      continue;
    }

    existing.totalAppointments += 1;
    for (const usedService of item.serviceNames ?? [item.serviceName]) {
      if (!existing.servicesUsed.includes(usedService)) {
        existing.servicesUsed.push(usedService);
      }
    }
    existing.bookingHistory.push({
      appointmentId: item.id,
      serviceName: item.serviceName,
      serviceNames: item.serviceNames,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      source: item.source,
      revenueAmount: item.revenueAmount,
      createdAt: item.createdAt
    });
    if (new Date(candidateAt) > new Date(existing.latestAppointmentAt)) {
      existing.latestAppointmentAt = candidateAt;
      existing.customerName = item.customerName;
    }
  }

  for (const customer of grouped.values()) {
    customer.bookingHistory.sort((a, b) => compareDateTime(b.date, b.startTime) - compareDateTime(a.date, a.startTime));
  }

  return [...grouped.values()].sort((a, b) => b.totalAppointments - a.totalAppointments);
}

export class CustomerAnalyticsService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  listCustomers(): CustomerSummary[] {
    return buildCustomerSummaries(this.appointmentRepository.list());
  }
}
