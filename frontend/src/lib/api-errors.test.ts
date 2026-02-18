import { describe, expect, it } from "vitest";
import { ApiRequestError, parseApiError } from "./api-errors";

describe("api-errors", () => {
  it("parses new backend envelope error shape", async () => {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "TIME_SLOT_UNAVAILABLE",
          message: "Selected time is no longer available",
          details: { field: "startTime" }
        }
      }),
      { status: 409 }
    );

    const error = await parseApiError(response);

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(409);
    expect(error.code).toBe("TIME_SLOT_UNAVAILABLE");
    expect(error.message).toContain("Selected time is no longer available");
  });

  it("parses compatibility legacy fields", async () => {
    const response = new Response(
      JSON.stringify({
        message: "Invalid request body",
        errorCode: "VALIDATION_ERROR",
        errors: {
          fieldErrors: {
            date: ["date must be YYYY-MM-DD"]
          }
        }
      }),
      { status: 400 }
    );

    const error = await parseApiError(response);

    expect(error.status).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toContain("date must be YYYY-MM-DD");
  });
});
