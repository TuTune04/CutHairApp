import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/errors";
import type { BookingDatabase } from "../src/types";

let currentDb: BookingDatabase;

function createSeedDb(): BookingDatabase {
  return {
    services: [
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
    ],
    appointments: [
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
    ]
  };
}

vi.mock("../src/database", () => ({
  readDatabase: vi.fn(() => currentDb),
  writeDatabase: vi.fn((data: BookingDatabase) => {
    currentDb = data;
  })
}));

describe("booking-service unit", () => {
  beforeEach(() => {
    currentDb = createSeedDb();
  });

  it("creates appointment with derived endTime and service revenue", async () => {
    const service = await import("../src/booking-service");
    const result = service.createAppointment({
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

  it("rejects overlapping app appointment", async () => {
    const service = await import("../src/booking-service");

    expect(() =>
      service.createAppointment({
        customerName: "Overlap",
        phoneNumber: "0909999999",
        serviceName: "Goi Nam/Nu",
        date: "2026-02-20",
        startTime: "09:30",
        durationMinutes: 30
      })
    ).toThrowError(AppError);

    try {
      service.createAppointment({
        customerName: "Overlap",
        phoneNumber: "0909999999",
        serviceName: "Goi Nam/Nu",
        date: "2026-02-20",
        startTime: "09:30",
        durationMinutes: 30
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("TIME_SLOT_UNAVAILABLE");
    }
  });

  it("creates external revenue entry with normalized schedule fields", async () => {
    const service = await import("../src/booking-service");
    const result = service.createExternalRevenue({
      customerName: "Walk-in",
      phoneNumber: "0902345678",
      date: "2026-02-20",
      serviceNames: ["Cat, xa toc Nam", "Goi Nam/Nu"]
    });

    expect(result.source).toBe("external");
    expect(result.startTime).toBe("00:00");
    expect(result.endTime).toBe("00:00");
    expect(result.revenueAmount).toBe(80000);
    expect(result.serviceNames).toEqual(["Cat, xa toc Nam", "Goi Nam/Nu"]);
  });

  it("converts appointment to external and normalizes times", async () => {
    const service = await import("../src/booking-service");
    const updated = service.updateAppointment("a1", {
      source: "external"
    });

    expect(updated.source).toBe("external");
    expect(updated.startTime).toBe("00:00");
    expect(updated.endTime).toBe("00:00");
  });

  it("converts external appointment back to app and recalculates schedule", async () => {
    const service = await import("../src/booking-service");
    const external = service.createExternalRevenue({
      customerName: "Walk-in",
      phoneNumber: "0902345678",
      date: "2026-02-20",
      serviceNames: ["Cat, xa toc Nam"]
    });

    const updated = service.updateAppointment(external.id, {
      source: "app",
      startTime: "11:00",
      durationMinutes: 45
    });

    expect(updated.source).toBe("app");
    expect(updated.startTime).toBe("11:00");
    expect(updated.endTime).toBe("11:45");
  });
});
