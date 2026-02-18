import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  delete process.env.ADMIN_API_KEY;
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_AUTH_SECRET;
  delete process.env.ADMIN_TOKEN_TTL_MINUTES;
});

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

  it("requires admin API key for protected routes when configured", async () => {
    process.env.ADMIN_API_KEY = "secret-key";
    vi.resetModules();
    const { app } = await import("../src/index");

    const response = await request(app).get("/api/v1/customers");
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("accepts protected route with valid admin API key", async () => {
    process.env.ADMIN_API_KEY = "secret-key";
    vi.resetModules();
    const { app } = await import("../src/index");

    const response = await request(app).get("/api/v1/customers").set("x-admin-api-key", "secret-key");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("allows admin login with username and password", async () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "password-123";
    process.env.ADMIN_AUTH_SECRET = "test-secret";
    vi.resetModules();
    const { app } = await import("../src/index");

    const response = await request(app).post("/api/v1/auth/admin/login").send({
      username: "admin",
      password: "password-123"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(typeof response.body.data.accessToken).toBe("string");
    expect(response.body.data.tokenType).toBe("Bearer");
  });

  it("accepts protected route with bearer token from admin login", async () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "password-123";
    process.env.ADMIN_AUTH_SECRET = "test-secret";
    vi.resetModules();
    const { app } = await import("../src/index");

    const loginResponse = await request(app).post("/api/v1/auth/admin/login").send({
      username: "admin",
      password: "password-123"
    });
    const accessToken = String(loginResponse.body.data.accessToken);

    const protectedResponse = await request(app)
      .get("/api/v1/customers")
      .set("authorization", `Bearer ${accessToken}`);
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.success).toBe(true);
  });
});
