import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

const tempDirectories: string[] = [];

async function createIsolatedApp() {
  const tempDirectory = mkdtempSync(path.join(os.tmpdir(), "cut-hair-backend-test-"));
  tempDirectories.push(tempDirectory);

  process.env.BOOKING_DB_PATH = path.join(tempDirectory, "booking-db.json");
  process.env.NODE_ENV = "test";
  vi.resetModules();

  const { app } = await import("../src/index");
  return app;
}

afterEach(() => {
  delete process.env.BOOKING_DB_PATH;
});

describe("http integration (real service + real test db)", () => {
  it("rejects non-existent calendar date for create appointment", async () => {
    const app = await createIsolatedApp();
    const response = await request(app).post("/appointments").send({
      customerName: "Le Minh",
      phoneNumber: "0901234567",
      serviceName: "Cat, xa toc Nam",
      date: "2026-02-30",
      startTime: "10:00",
      durationMinutes: 45
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("runs service CRUD and reflects in catalog APIs", async () => {
    const app = await createIsolatedApp();

    const createResponse = await request(app).post("/catalog/services").send({
      id: "test-service-1",
      name: "Test Service 1",
      category: "Dich vu le",
      priceText: "123k",
      basePriceAmount: 123000,
      defaultDurationMinutes: 60
    });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);

    const listResponse = await request(app).get("/catalog/services");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.some((item: { id: string }) => item.id === "test-service-1")).toBe(true);

    const patchResponse = await request(app).patch("/catalog/services/test-service-1").send({
      priceText: "150k",
      basePriceAmount: 150000
    });
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.data.basePriceAmount).toBe(150000);

    const deleteResponse = await request(app).delete("/catalog/services/test-service-1");
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });

  it("updates appointment source app <-> external correctly", async () => {
    const app = await createIsolatedApp();

    const createdAppointment = await request(app).post("/appointments").send({
      customerName: "Le Minh",
      phoneNumber: "0901234567",
      serviceName: "Cat, xa toc Nam",
      date: "2026-02-21",
      startTime: "10:00",
      durationMinutes: 45
    });
    expect(createdAppointment.status).toBe(201);
    const appointmentId = createdAppointment.body.data.id as string;

    const switchedToExternal = await request(app).patch(`/appointments/${appointmentId}`).send({
      source: "external"
    });
    expect(switchedToExternal.status).toBe(200);
    expect(switchedToExternal.body.data.source).toBe("external");
    expect(switchedToExternal.body.data.startTime).toBe("00:00");
    expect(switchedToExternal.body.data.endTime).toBe("00:00");

    const switchedBackToApp = await request(app).patch(`/appointments/${appointmentId}`).send({
      source: "app",
      startTime: "11:00",
      durationMinutes: 45
    });
    expect(switchedBackToApp.status).toBe(200);
    expect(switchedBackToApp.body.data.source).toBe("app");
    expect(switchedBackToApp.body.data.startTime).toBe("11:00");
    expect(switchedBackToApp.body.data.endTime).toBe("11:45");
  });

  it("returns availability and revenue summaries after creating records", async () => {
    const app = await createIsolatedApp();

    const createAppOrder = await request(app).post("/appointments").send({
      customerName: "Le Minh",
      phoneNumber: "0901234567",
      serviceName: "Cat, xa toc Nam",
      date: "2026-02-22",
      startTime: "09:00",
      durationMinutes: 45
    });
    expect(createAppOrder.status).toBe(201);

    const createExternalOrder = await request(app).post("/external-revenues").send({
      phoneNumber: "0901234567",
      date: "2026-02-22",
      serviceNames: ["Cat, xa toc Nam", "Goi Nam/Nu"]
    });
    expect(createExternalOrder.status).toBe(201);

    const availabilityResponse = await request(app).get("/availability?date=2026-02-22&durationMinutes=45");
    expect(availabilityResponse.status).toBe(200);
    expect(Array.isArray(availabilityResponse.body.data.freeSlots)).toBe(true);
    expect(availabilityResponse.body.data.freeSlots.includes("09:00")).toBe(false);

    const dailyRevenue = await request(app).get("/revenues/daily?from=2026-02-22&to=2026-02-22");
    expect(dailyRevenue.status).toBe(200);
    expect(dailyRevenue.body.data[0].date).toBe("2026-02-22");
    expect(dailyRevenue.body.data[0].totalRevenue).toBeGreaterThan(0);
  });
});

afterEach(() => {
  while (tempDirectories.length > 0) {
    const directory = tempDirectories.pop();
    if (directory) {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});
