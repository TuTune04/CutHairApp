import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/errors";

const bookingServiceMocks = vi.hoisted(() => ({
  createService: vi.fn(),
  createAppointment: vi.fn(),
  createExternalRevenue: vi.fn(),
  deleteService: vi.fn(),
  deleteAppointment: vi.fn(),
  getAppointmentById: vi.fn(),
  getAvailabilityByDate: vi.fn(),
  getServiceById: vi.fn(),
  listAppointments: vi.fn(),
  listServiceCategories: vi.fn(),
  listCustomers: vi.fn(),
  listDailyRevenue: vi.fn(),
  listMonthlyRevenue: vi.fn(),
  listServices: vi.fn(),
  updateAppointment: vi.fn(),
  updateService: vi.fn()
}));

vi.mock("../src/booking-service", () => bookingServiceMocks);

describe("http contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health envelope", async () => {
    const { app } = await import("../src/index");
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });

  it("returns validation envelope for invalid create appointment body", async () => {
    const { app } = await import("../src/index");
    const response = await request(app).post("/appointments").send({
      customerName: "A"
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(typeof response.body.error.message).toBe("string");
  });

  it("maps AppError to standardized error payload", async () => {
    bookingServiceMocks.createAppointment.mockImplementation(() => {
      throw new AppError("TIME_SLOT_UNAVAILABLE", "Selected time is no longer available", 409);
    });
    const { app } = await import("../src/index");

    const response = await request(app).post("/appointments").send({
      customerName: "Le Minh",
      phoneNumber: "0901234567",
      serviceName: "Cat, xa toc Nam",
      date: "2026-02-22",
      startTime: "09:00",
      durationMinutes: 45
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("TIME_SLOT_UNAVAILABLE");
  });

  it("returns appointments list through success envelope", async () => {
    bookingServiceMocks.listAppointments.mockReturnValue([
      {
        id: "a1",
        customerName: "Le Minh",
        phoneNumber: "0901234567",
        serviceName: "Cat, xa toc Nam",
        date: "2026-02-22",
        startTime: "10:00",
        endTime: "10:45",
        source: "app",
        revenueAmount: 40000,
        createdAt: "2026-02-20T00:00:00.000Z"
      }
    ]);
    const { app } = await import("../src/index");

    const response = await request(app).get("/appointments");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].id).toBe("a1");
  });
});
