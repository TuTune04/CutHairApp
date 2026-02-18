import { describe, expect, it } from "vitest";
import { ApiRequestError } from "./api-errors";
import { buildApiErrorNotice, buildSuccessNotice } from "./notice";

describe("notice mapping", () => {
  it("maps known error code to business-friendly warning", () => {
    const error = new ApiRequestError("Selected time is no longer available", {
      status: 409,
      code: "TIME_SLOT_UNAVAILABLE"
    });

    const notice = buildApiErrorNotice(error);

    expect(notice.variant).toBe("warning");
    expect(notice.title).toContain("Khung gio");
  });

  it("uses validation title override for validation errors", () => {
    const error = new ApiRequestError("date must be YYYY-MM-DD", {
      status: 400,
      code: "VALIDATION_ERROR"
    });

    const notice = buildApiErrorNotice(error, {
      validationTitle: "Thong tin dat lich chua dung"
    });

    expect(notice.variant).toBe("error");
    expect(notice.title).toBe("Thong tin dat lich chua dung");
    expect(notice.message).toContain("date must be YYYY-MM-DD");
  });

  it("builds success notice for success flow", () => {
    const notice = buildSuccessNotice("Dat lich thanh cong", "Hen gap ban luc 10:00.");

    expect(notice.variant).toBe("success");
    expect(notice.title).toBe("Dat lich thanh cong");
  });
});
