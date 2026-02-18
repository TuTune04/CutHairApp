import type { Appointment, DailyRevenue, MonthlyRevenue } from "../types";
import type { AppointmentRepository } from "../repositories/database.repository";

export function buildDailyRevenue(appointments: Appointment[], fromDate?: string, toDate?: string): DailyRevenue[] {
  const grouped = new Map<string, DailyRevenue>();

  for (const appointment of appointments) {
    if (fromDate && appointment.date < fromDate) continue;
    if (toDate && appointment.date > toDate) continue;

    const existing = grouped.get(appointment.date);
    if (!existing) {
      grouped.set(appointment.date, {
        date: appointment.date,
        totalRevenue: appointment.revenueAmount,
        totalAppointments: 1,
        appOrders: appointment.source === "app" ? 1 : 0,
        externalOrders: appointment.source === "external" ? 1 : 0
      });
      continue;
    }

    existing.totalRevenue += appointment.revenueAmount;
    existing.totalAppointments += 1;
    if (appointment.source === "app") existing.appOrders += 1;
    else existing.externalOrders += 1;
  }

  return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function buildMonthlyRevenue(appointments: Appointment[], year?: string): MonthlyRevenue[] {
  const grouped = new Map<string, MonthlyRevenue>();

  for (const appointment of appointments) {
    const monthKey = appointment.date.slice(0, 7);
    if (year && !monthKey.startsWith(`${year}-`)) continue;

    const existing = grouped.get(monthKey);
    if (!existing) {
      grouped.set(monthKey, {
        month: monthKey,
        totalRevenue: appointment.revenueAmount,
        totalAppointments: 1
      });
      continue;
    }

    existing.totalRevenue += appointment.revenueAmount;
    existing.totalAppointments += 1;
  }

  return [...grouped.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export class RevenueAnalyticsService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  listDaily(fromDate?: string, toDate?: string): DailyRevenue[] {
    return buildDailyRevenue(this.appointmentRepository.list(), fromDate, toDate);
  }

  listMonthly(year?: string): MonthlyRevenue[] {
    return buildMonthlyRevenue(this.appointmentRepository.list(), year);
  }
}
