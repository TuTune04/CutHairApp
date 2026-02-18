import { ApiRequestError, isApiRequestError } from "./api-errors"

export type NoticeVariant = "success" | "warning" | "error" | "info"

export interface AppNotice {
  variant: NoticeVariant
  title: string
  message: string
}

const API_ERROR_NOTICE_MAP: Record<string, Pick<AppNotice, "variant" | "title" | "message">> = {
  TIME_SLOT_UNAVAILABLE: {
    variant: "warning",
    title: "Khung gio da co nguoi dat",
    message: "Vui long chon khung gio khac de tranh trung lich."
  },
  OUTSIDE_WORKING_HOURS: {
    variant: "warning",
    title: "Ngoai gio lam viec",
    message: "Salon chi nhan lich trong khung 09:00 - 18:00."
  },
  SERVICE_NOT_AVAILABLE: {
    variant: "error",
    title: "Dich vu khong hop le",
    message: "Vui long chon lai dich vu trong danh sach hien co."
  }
}

export function buildApiErrorNotice(
  error: unknown,
  options?: { validationTitle?: string; fallbackTitle?: string }
): AppNotice {
  if (isApiRequestError(error)) {
    if (error.code === "VALIDATION_ERROR") {
      return {
        variant: "error",
        title: options?.validationTitle ?? "Thong tin khong hop le",
        message: error.message
      }
    }

    if (error.code && API_ERROR_NOTICE_MAP[error.code]) {
      return API_ERROR_NOTICE_MAP[error.code]
    }

    return {
      variant: "error",
      title: options?.fallbackTitle ?? "Khong the thuc hien luc nay",
      message: error.message || "Vui long thu lai sau it phut."
    }
  }

  return {
    variant: "error",
    title: options?.fallbackTitle ?? "Khong the thuc hien luc nay",
    message: error instanceof Error ? error.message : "Da xay ra loi khong xac dinh."
  }
}

export function buildSuccessNotice(title: string, message: string): AppNotice {
  return {
    variant: "success",
    title,
    message
  }
}

export function toApiRequestError(error: unknown): ApiRequestError | undefined {
  return isApiRequestError(error) ? error : undefined
}
