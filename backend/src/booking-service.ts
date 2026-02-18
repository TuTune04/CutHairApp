import { randomUUID } from "node:crypto";
import { readDatabase, writeDatabase } from "./database";
import { AppError } from "./errors";
import {
  Appointment,
  CreateAppointmentInput,
  CreateExternalRevenueInput,
  CustomerSummary,
  DailyRevenue,
  MonthlyRevenue,
  ServiceCategory,
  ServiceItem,
  TimeSlot,
  UpdateAppointmentInput,
  UpdateServiceInput
} from "./types/index";

const SHOP_OPEN_HOUR = 9;
const SHOP_CLOSE_HOUR = 18;
const SLOT_STEP_MINUTES = 30;
const DEFAULT_DURATION_MINUTES = 60;

function parseMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function formatMinutes(totalMinutes: number): TimeSlot {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const hourText = String(hour).padStart(2, "0");
  const minuteText = String(minute).padStart(2, "0");
  return `${hourText}:${minuteText}` as TimeSlot;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function compareDateTime(date: string, time: string): number {
  return new Date(`${date}T${time}:00`).getTime();
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

function getServiceByNameOrThrow(name: string): ServiceItem {
  const db = readDatabase();
  const found = db.services.find((service) => service.name.toLowerCase() === name.trim().toLowerCase());
  if (!found) {
    throw new AppError("SERVICE_NOT_AVAILABLE", "Selected service is not available", 404);
  }
  return found;
}

function assertWorkingHours(startMinutes: number, endMinutes: number): void {
  const openMinutes = SHOP_OPEN_HOUR * 60;
  const closeMinutes = SHOP_CLOSE_HOUR * 60;
  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    throw new AppError("OUTSIDE_WORKING_HOURS", "Selected time is outside working hours", 409);
  }
}

function assertNoConflict(date: string, startMinutes: number, endMinutes: number, ignoreId?: string): void {
  const db = readDatabase();
  const hasConflict = db.appointments
    .filter((item) => item.date === date && item.source === "app" && item.id !== ignoreId)
    .some((item) => {
      const busyStart = parseMinutes(item.startTime);
      const busyEnd = parseMinutes(item.endTime);
      return overlaps(startMinutes, endMinutes, busyStart, busyEnd);
    });
  if (hasConflict) {
    throw new AppError("TIME_SLOT_UNAVAILABLE", "Selected time is no longer available", 409);
  }
}

export function listAppointments(): Appointment[] {
  const db = readDatabase();
  return [...db.appointments].sort((a, b) => compareDateTime(a.date, a.startTime) - compareDateTime(b.date, b.startTime));
}

export function getAppointmentById(id: string): Appointment {
  const db = readDatabase();
  const found = db.appointments.find((item) => item.id === id);
  if (!found) {
    throw new AppError("NOT_FOUND", "Appointment not found", 404);
  }
  return found;
}

export function deleteAppointment(id: string): Appointment {
  const db = readDatabase();
  const index = db.appointments.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new AppError("NOT_FOUND", "Appointment not found", 404);
  }
  const [removed] = db.appointments.splice(index, 1);
  writeDatabase(db);
  return removed;
}

export function updateAppointment(id: string, patch: UpdateAppointmentInput): Appointment {
  const db = readDatabase();
  const index = db.appointments.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new AppError("NOT_FOUND", "Appointment not found", 404);
  }

  const current = db.appointments[index];
  const next: Appointment = { ...current };

  if (patch.customerName !== undefined) {
    next.customerName = patch.customerName;
  }
  if (patch.phoneNumber !== undefined) {
    next.phoneNumber = patch.phoneNumber;
  }
  if (patch.date !== undefined) {
    next.date = patch.date;
  }
  if (patch.notes !== undefined) {
    next.notes = patch.notes;
  }
  if (patch.source !== undefined) {
    next.source = patch.source;
  }

  const service = patch.serviceName ? getServiceByNameOrThrow(patch.serviceName) : undefined;
  if (service) {
    next.serviceName = service.name;
    next.serviceNames = [service.name];
    if (patch.revenueAmount === undefined) {
      next.revenueAmount = service.basePriceAmount;
    }
  }
  if (patch.revenueAmount !== undefined) {
    next.revenueAmount = patch.revenueAmount;
  }

  if (next.source === "app") {
    const nextStart = patch.startTime ?? next.startTime;
    const durationMinutes = patch.durationMinutes ?? parseMinutes(next.endTime) - parseMinutes(next.startTime);
    const startMinutes = parseMinutes(nextStart);
    const endMinutes = startMinutes + durationMinutes;
    assertWorkingHours(startMinutes, endMinutes);
    assertNoConflict(next.date, startMinutes, endMinutes, id);
    next.startTime = nextStart;
    next.endTime = formatMinutes(endMinutes);
  } else {
    // External revenue rows are bookkeeping entries, not scheduled slots.
    next.startTime = "00:00";
    next.endTime = "00:00";
  }

  db.appointments[index] = next;
  writeDatabase(db);
  return next;
}

export function listServices(category?: ServiceCategory): ServiceItem[] {
  const db = readDatabase();
  const rows = category ? db.services.filter((item) => item.category === category) : db.services;
  return [...rows].sort((a, b) => a.name.localeCompare(b.name));
}

export function getServiceById(id: string): ServiceItem {
  const db = readDatabase();
  const found = db.services.find((item) => item.id === id);
  if (!found) {
    throw new AppError("NOT_FOUND", "Service not found", 404);
  }
  return found;
}

export function listServiceCategories(): ServiceCategory[] {
  const db = readDatabase();
  return [...new Set(db.services.map((item) => item.category))];
}

export function updateService(id: string, patch: UpdateServiceInput): ServiceItem {
  const db = readDatabase();
  const index = db.services.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new AppError("NOT_FOUND", "Service not found", 404);
  }
  const next = { ...db.services[index], ...patch };
  db.services[index] = next;
  writeDatabase(db);
  return next;
}

export function createService(input: ServiceItem): ServiceItem {
  const db = readDatabase();
  if (db.services.some((item) => item.id === input.id)) {
    throw new AppError("CONFLICT", "Service id already exists", 409);
  }
  if (db.services.some((item) => item.name.toLowerCase() === input.name.toLowerCase())) {
    throw new AppError("CONFLICT", "Service name already exists", 409);
  }
  db.services.push(input);
  writeDatabase(db);
  return input;
}

export function deleteService(id: string): ServiceItem {
  const db = readDatabase();
  const index = db.services.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new AppError("NOT_FOUND", "Service not found", 404);
  }
  const [removed] = db.services.splice(index, 1);
  writeDatabase(db);
  return removed;
}

export function listCustomers(): CustomerSummary[] {
  const db = readDatabase();
  const grouped = new Map<string, CustomerSummary>();

  for (const item of db.appointments) {
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

export function listDailyRevenue(fromDate?: string, toDate?: string): DailyRevenue[] {
  const db = readDatabase();
  const grouped = new Map<string, DailyRevenue>();

  for (const appointment of db.appointments) {
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

export function listMonthlyRevenue(year?: string): MonthlyRevenue[] {
  const db = readDatabase();
  const grouped = new Map<string, MonthlyRevenue>();

  for (const appointment of db.appointments) {
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

export function getAvailabilityByDate(date: string, durationMinutes = DEFAULT_DURATION_MINUTES): TimeSlot[] {
  const db = readDatabase();
  const dayAppointments = db.appointments.filter((item) => item.date === date && item.source === "app");
  const openMinutes = SHOP_OPEN_HOUR * 60;
  const closeMinutes = SHOP_CLOSE_HOUR * 60;
  const lastStart = closeMinutes - durationMinutes;
  const freeSlots: TimeSlot[] = [];

  for (let start = openMinutes; start <= lastStart; start += SLOT_STEP_MINUTES) {
    const end = start + durationMinutes;
    const isBusy = dayAppointments.some((item) => {
      const busyStart = parseMinutes(item.startTime);
      const busyEnd = parseMinutes(item.endTime);
      return overlaps(start, end, busyStart, busyEnd);
    });
    if (!isBusy) freeSlots.push(formatMinutes(start));
  }

  return freeSlots;
}

export function createAppointment(input: CreateAppointmentInput): Appointment {
  const db = readDatabase();
  const service = getServiceByNameOrThrow(input.serviceName);
  const durationMinutes = input.durationMinutes ?? service.defaultDurationMinutes ?? DEFAULT_DURATION_MINUTES;
  const startMinutes = parseMinutes(input.startTime);
  const endMinutes = startMinutes + durationMinutes;
  assertWorkingHours(startMinutes, endMinutes);
  assertNoConflict(input.date, startMinutes, endMinutes);

  const nextAppointment: Appointment = {
    id: randomUUID(),
    customerName: input.customerName,
    phoneNumber: input.phoneNumber,
    serviceName: service.name,
    date: input.date,
    startTime: input.startTime,
    endTime: formatMinutes(endMinutes),
    source: input.source ?? "app",
    revenueAmount: input.revenueAmount ?? service.basePriceAmount,
    serviceNames: [service.name],
    notes: input.notes,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(nextAppointment);
  writeDatabase(db);
  return nextAppointment;
}

export function createExternalRevenue(input: CreateExternalRevenueInput): Appointment {
  const db = readDatabase();
  const normalizedServiceNames = input.serviceNames.map((name) => name.trim()).filter(Boolean);
  if (normalizedServiceNames.length === 0) {
    throw new AppError("VALIDATION_ERROR", "At least one service is required", 400);
  }

  const selectedServices = normalizedServiceNames.map((serviceName) => getServiceByNameOrThrow(serviceName));
  const calculatedRevenue = selectedServices.reduce((sum, service) => sum + service.basePriceAmount, 0);
  const totalRevenue = input.totalRevenue ?? calculatedRevenue;
  const normalizedPhone = normalizePhoneNumber(input.phoneNumber);
  const latestCustomerRecord = listCustomers().find((item) => normalizePhoneNumber(item.phoneNumber) === normalizedPhone);
  const displayName = input.customerName?.trim() || latestCustomerRecord?.customerName || "Khach le";

  const nextRecord: Appointment = {
    id: randomUUID(),
    customerName: displayName,
    phoneNumber: input.phoneNumber,
    serviceName: selectedServices.map((service) => service.name).join(" + "),
    serviceNames: selectedServices.map((service) => service.name),
    date: input.date,
    startTime: "00:00",
    endTime: "00:00",
    source: "external",
    revenueAmount: totalRevenue,
    notes: input.notes,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(nextRecord);
  writeDatabase(db);
  return nextRecord;
}
