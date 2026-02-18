import request from "supertest";
import { describe, expect, it } from "vitest";

describe("http contract", () => {

  it("returns health envelope", async () => {
    const { app } = await import("../src/index");
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });

  it("returns validation envelope for invalid create appointment body", async () => {
    const { app } = await import("../src/index");
    const response = await request(app).post("/api/v1/appointments").send({
      customerName: "A"
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(typeof response.body.error.message).toBe("string");
  });

  it("returns route not found in standardized envelope", async () => {
    const { app } = await import("../src/index");
    const response = await request(app).get("/api/v1/not-exists");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
