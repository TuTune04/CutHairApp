import { beforeEach, describe, expect, it } from "vitest";
import { AppError } from "../src/errors";
import type { AppointmentRepository, ServiceRepository } from "../src/repositories/database.repository";
import type { Appointment, ServiceItem } from "../src/types";
import { AppointmentService } from "../src/services/appointment.service";
import { CatalogService } from "../src/services/catalog.service";
import { buildCustomerSummaries } from "../src/services/customer-analytics.service";
import { buildDailyRevenue, buildMonthlyRevenue } from "../src/services/revenue-analytics.service";

class InMemoryAppointmentRepository implements AppointmentRepository {
  constructor(private rows: Appointment[]) {}

  list(): Appointment[] {
    return this.rows;
  }

  saveAll(rows: Appointment[]): void {
    this.rows = rows;
  }
}

class InMemoryServiceRepository implements ServiceRepository {
  constructor(private rows: ServiceItem[]) {}

  list(): ServiceItem[] {
    return this.rows;
  }

  saveAll(rows: ServiceItem[]): void {
    this.rows = rows;
  }
}

describe("domain services unit", () => {
  let appointmentRepository: InMemoryAppointmentRepository;
  let serviceRepository: InMemoryServiceRepository;
  let appointmentService: AppointmentService;

  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentRepository([
      {
        id: "a1",
        customerName: "A",
        phoneNumber: "0900000001",
        serviceName: "Cat, xa toc Nam",
        serviceNames: ["Cat, xa toc Nam"],
        date: "2026-02-20",
        startTime: "09:00",
        endTime: "09:45",
        source: "app",
        revenueAmount: 40000,
        createdAt: "2026-02-20T00:00:00.000Z"
      }
    ]);
    serviceRepository = new InMemoryServiceRepository([
      {
        id: "cut-men",
        name: "Cat, xa toc Nam",
        category: "Dich vu le",
        priceText: "40k",
        basePriceAmount: 40000,
        defaultDurationMinutes: 45
      },
      {
        id: "shampoo",
        name: "Goi Nam/Nu",
        category: "Dich vu le",
        priceText: "40k",
        basePriceAmount: 40000,
        defaultDurationMinutes: 30
      }
    ]);
    const catalogService = new CatalogService(serviceRepository);
    appointmentService = new AppointmentService(appointmentRepository, catalogService);
  });

  it("creates appointment with derived endTime and service revenue", () => {
    const result = appointmentService.create({
      customerName: "Le Minh",
      phoneNumber: "0901234567",
      serviceName: "Cat, xa toc Nam",
      date: "2026-02-20",
      startTime: "10:00",
      notes: "khach moi"
    });

    expect(result.endTime).toBe("10:45");
    expect(result.revenueAmount).toBe(40000);
    expect(result.serviceNames).toEqual(["Cat, xa toc Nam"]);
    expect(result.source).toBe("app");
  });

  it("allows overlapping appointment when slot capacity is not full", () => {
    const result = appointmentService.create({
      customerName: "Overlap",
      phoneNumber: "0909999999",
      serviceName: "Goi Nam/Nu",
      date: "2026-02-20",
      startTime: "09:30",
      durationMinutes: 30
    });
    expect(result.source).toBe("app");
    expect(result.startTime).toBe("09:30");
  });

  it("rejects overlapping appointment when slot reaches max capacity", () => {
    appointmentService.create({
      customerName: "Overlap 1",
      phoneNumber: "0909999998",
      serviceName: "Goi Nam/Nu",
      date: "2026-02-20",
      startTime: "09:15",
      durationMinutes: 30
    });
    appointmentService.create({
      customerName: "Overlap 2",
      phoneNumber: "0909999997",
      serviceName: "Goi Nam/Nu",
      date: "2026-02-20",
      startTime: "09:20",
      durationMinutes: 30
    });
    appointmentService.create({
      customerName: "Overlap 3",
      phoneNumber: "0909999996",
      serviceName: "Goi Nam/Nu",
      date: "2026-02-20",
      startTime: "09:25",
      durationMinutes: 30
    });

    expect(() =>
      appointmentService.create({
        customerName: "Overlap 4",
        phoneNumber: "0909999995",
        serviceName: "Goi Nam/Nu",
        date: "2026-02-20",
        startTime: "09:30",
        durationMinutes: 30
      })
    ).toThrowError(AppError);
  });

  it("converts source app <-> external using domain rules", () => {
    const external = appointmentService.update("a1", { source: "external" });
    expect(external.startTime).toBe("00:00");
    expect(external.endTime).toBe("00:00");

    const restored = appointmentService.update("a1", {
      source: "app",
      startTime: "11:00",
      durationMinutes: 45
    });
    expect(restored.startTime).toBe("11:00");
    expect(restored.endTime).toBe("11:45");
  });

  it("builds customer and revenue analytics projections", () => {
    const rows = appointmentRepository.list();
    const customers = buildCustomerSummaries(rows);
    const daily = buildDailyRevenue(rows, "2026-02-20", "2026-02-20");
    const monthly = buildMonthlyRevenue(rows, "2026");

    expect(customers.length).toBeGreaterThan(0);
    expect(daily[0].totalRevenue).toBeGreaterThan(0);
    expect(monthly[0].month).toBe("2026-02");
  });
});
