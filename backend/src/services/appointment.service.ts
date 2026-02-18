import { randomUUID } from "node:crypto";
import { MAX_CONCURRENT_APPOINTMENTS, SHOP_CLOSE_HOUR, SHOP_OPEN_HOUR } from "../config";
import { AppError } from "../errors";
import type { Appointment, CreateAppointmentInput, CreateExternalRevenueInput, TimeSlot, UpdateAppointmentInput } from "../types";
import type { AppointmentRepository } from "../repositories/database.repository";
import { compareDateTime, formatMinutes, overlaps, parseMinutes } from "../utils/time.utils";
import { normalizePhoneNumber } from "../utils/phone.utils";
import { CatalogService } from "./catalog.service";

export class AppointmentService {
  private static readonly DEFAULT_DURATION_MINUTES = 60;

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly catalogService: CatalogService
  ) {}

  list(): Appointment[] {
    return [...this.appointmentRepository.list()].sort(
      (a, b) => compareDateTime(a.date, a.startTime) - compareDateTime(b.date, b.startTime)
    );
  }

  getById(id: string): Appointment {
    const found = this.appointmentRepository.list().find((item) => item.id === id);
    if (!found) {
      throw new AppError("NOT_FOUND", "Appointment not found", 404);
    }
    return found;
  }

  remove(id: string): Appointment {
    const rows = this.appointmentRepository.list();
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("NOT_FOUND", "Appointment not found", 404);
    }
    const nextRows = [...rows];
    const [removed] = nextRows.splice(index, 1);
    this.appointmentRepository.saveAll(nextRows);
    return removed;
  }

  create(input: CreateAppointmentInput): Appointment {
    const rows = this.appointmentRepository.list();
    const service = this.catalogService.getByNameOrThrow(input.serviceName);
    const durationMinutes = input.durationMinutes ?? service.defaultDurationMinutes ?? AppointmentService.DEFAULT_DURATION_MINUTES;
    const startMinutes = parseMinutes(input.startTime);
    const endMinutes = startMinutes + durationMinutes;
    this.assertWorkingHours(startMinutes, endMinutes);
    this.assertNoConflict(rows, input.date, startMinutes, endMinutes);

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

    this.appointmentRepository.saveAll([...rows, nextAppointment]);
    return nextAppointment;
  }

  createExternalRevenue(input: CreateExternalRevenueInput): Appointment {
    const rows = this.appointmentRepository.list();
    const normalizedServiceNames = input.serviceNames.map((name) => name.trim()).filter(Boolean);
    if (normalizedServiceNames.length === 0) {
      throw new AppError("VALIDATION_ERROR", "At least one service is required", 400);
    }

    const selectedServices = normalizedServiceNames.map((serviceName) => this.catalogService.getByNameOrThrow(serviceName));
    const calculatedRevenue = selectedServices.reduce((sum, service) => sum + service.basePriceAmount, 0);
    const totalRevenue = input.totalRevenue ?? calculatedRevenue;
    const normalizedPhone = normalizePhoneNumber(input.phoneNumber);
    const latestCustomerRecord = this.list().find((item) => normalizePhoneNumber(item.phoneNumber) === normalizedPhone);
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

    this.appointmentRepository.saveAll([...rows, nextRecord]);
    return nextRecord;
  }

  update(id: string, patch: UpdateAppointmentInput): Appointment {
    const rows = this.appointmentRepository.list();
    const index = rows.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("NOT_FOUND", "Appointment not found", 404);
    }

    const current = rows[index];
    const next: Appointment = { ...current };

    if (patch.customerName !== undefined) next.customerName = patch.customerName;
    if (patch.phoneNumber !== undefined) next.phoneNumber = patch.phoneNumber;
    if (patch.date !== undefined) next.date = patch.date;
    if (patch.notes !== undefined) next.notes = patch.notes;
    if (patch.source !== undefined) next.source = patch.source;

    const service = patch.serviceName ? this.catalogService.getByNameOrThrow(patch.serviceName) : undefined;
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
      this.assertWorkingHours(startMinutes, endMinutes);
      this.assertNoConflict(rows, next.date, startMinutes, endMinutes, id);
      next.startTime = nextStart;
      next.endTime = formatMinutes(endMinutes);
    } else {
      next.startTime = "00:00";
      next.endTime = "00:00";
    }

    const nextRows = [...rows];
    nextRows[index] = next;
    this.appointmentRepository.saveAll(nextRows);
    return next;
  }

  listAvailability(date: string, durationMinutes = AppointmentService.DEFAULT_DURATION_MINUTES): TimeSlot[] {
    const rows = this.appointmentRepository.list();
    const dayAppointments = rows.filter((item) => item.date === date && item.source === "app");
    const openMinutes = SHOP_OPEN_HOUR * 60;
    const closeMinutes = SHOP_CLOSE_HOUR * 60;
    const lastStart = closeMinutes - durationMinutes;
    const freeSlots: TimeSlot[] = [];

    for (let start = openMinutes; start <= lastStart; start += 30) {
      const end = start + durationMinutes;
      const overlapCount = this.countOverlappingAppointments(dayAppointments, start, end);
      const isBusy = overlapCount >= MAX_CONCURRENT_APPOINTMENTS;
      if (!isBusy) freeSlots.push(formatMinutes(start));
    }

    return freeSlots;
  }

  private assertWorkingHours(startMinutes: number, endMinutes: number): void {
    const openMinutes = SHOP_OPEN_HOUR * 60;
    const closeMinutes = SHOP_CLOSE_HOUR * 60;
    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      throw new AppError("OUTSIDE_WORKING_HOURS", "Selected time is outside working hours", 409);
    }
  }

  private assertNoConflict(
    rows: Appointment[],
    date: string,
    startMinutes: number,
    endMinutes: number,
    ignoreId?: string
  ): void {
    const sameDayRows = rows.filter((item) => item.date === date && item.source === "app" && item.id !== ignoreId);
    const overlapCount = this.countOverlappingAppointments(sameDayRows, startMinutes, endMinutes);
    if (overlapCount >= MAX_CONCURRENT_APPOINTMENTS) {
      throw new AppError("TIME_SLOT_UNAVAILABLE", "Selected time slot is fully booked", 409);
    }
  }

  private countOverlappingAppointments(rows: Appointment[], startMinutes: number, endMinutes: number): number {
    return rows.reduce((count, item) => {
      const busyStart = parseMinutes(item.startTime);
      const busyEnd = parseMinutes(item.endTime);
      return overlaps(startMinutes, endMinutes, busyStart, busyEnd) ? count + 1 : count;
    }, 0);
  }
}
