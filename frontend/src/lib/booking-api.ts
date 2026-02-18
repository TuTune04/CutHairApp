import { parseApiError } from "./api-errors"

export interface Appointment {
  id: string
  customerName: string
  phoneNumber: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  source: "app" | "external"
  revenueAmount: number
  serviceNames?: string[]
  notes?: string
  createdAt: string
}

export interface CustomerSummary {
  customerName: string
  phoneNumber: string
  totalAppointments: number
  latestAppointmentAt: string
  servicesUsed?: string[]
  bookingHistory?: Array<{
    appointmentId: string
    serviceName: string
    serviceNames?: string[]
    date: string
    startTime: string
    endTime: string
    source: "app" | "external"
    revenueAmount: number
    createdAt: string
  }>
}

export interface CreateAppointmentPayload {
  customerName: string
  phoneNumber: string
  serviceName: string
  date: string
  startTime: string
  durationMinutes: number
  source?: "app" | "external"
  revenueAmount?: number
  notes?: string
}

export interface CreateExternalRevenuePayload {
  customerName?: string
  phoneNumber: string
  date: string
  serviceNames: string[]
  totalRevenue?: number
  notes?: string
}

export interface ServiceItem {
  id: string
  name: string
  category: "Dich vu le" | "Hoa chat" | "Phuc hoi"
  priceText: string
  basePriceAmount: number
  defaultDurationMinutes: number
}

export interface DailyRevenueItem {
  date: string
  totalRevenue: number
  totalAppointments: number
  appOrders: number
  externalOrders: number
}

export interface MonthlyRevenueItem {
  month: string
  totalRevenue: number
  totalAppointments: number
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await parseApiError(response)
  }

  return response.json() as Promise<T>
}

export async function getAppointments(baseUrl: string): Promise<Appointment[]> {
  const response = await fetch(`${baseUrl}/appointments`, { cache: "no-store" })
  const payload = await readJsonResponse<{ data: Appointment[] }>(response)
  return payload.data
}

export async function getCustomers(baseUrl: string): Promise<CustomerSummary[]> {
  const response = await fetch(`${baseUrl}/customers`, { cache: "no-store" })
  const payload = await readJsonResponse<{ data: CustomerSummary[] }>(response)
  return payload.data
}

export async function getServices(baseUrl: string): Promise<ServiceItem[]> {
  const response = await fetch(`${baseUrl}/services`, { cache: "no-store" })
  const payload = await readJsonResponse<{ data: ServiceItem[] }>(response)
  return payload.data
}

export async function getAvailability(
  baseUrl: string,
  date: string,
  durationMinutes: number
): Promise<string[]> {
  const searchParams = new URLSearchParams({
    date,
    durationMinutes: String(durationMinutes),
  })
  const response = await fetch(`${baseUrl}/availability?${searchParams.toString()}`, {
    cache: "no-store",
  })
  const payload = await readJsonResponse<{ freeSlots: string[] }>(response)
  return payload.freeSlots
}

export async function createAppointment(baseUrl: string, payload: CreateAppointmentPayload): Promise<Appointment> {
  const response = await fetch(`${baseUrl}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await readJsonResponse<{ data: Appointment }>(response)
  return result.data
}

export async function createExternalRevenue(
  baseUrl: string,
  payload: CreateExternalRevenuePayload
): Promise<Appointment> {
  const response = await fetch(`${baseUrl}/external-revenues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await readJsonResponse<{ data: Appointment }>(response)
  return result.data
}

export async function getDailyRevenue(
  baseUrl: string,
  fromDate?: string,
  toDate?: string
): Promise<DailyRevenueItem[]> {
  const searchParams = new URLSearchParams()
  if (fromDate) {
    searchParams.set("from", fromDate)
  }
  if (toDate) {
    searchParams.set("to", toDate)
  }
  const query = searchParams.toString()
  const response = await fetch(`${baseUrl}/revenues/daily${query ? `?${query}` : ""}`, { cache: "no-store" })
  const payload = await readJsonResponse<{ data: DailyRevenueItem[] }>(response)
  return payload.data
}

export async function getMonthlyRevenue(baseUrl: string, year?: string): Promise<MonthlyRevenueItem[]> {
  const searchParams = new URLSearchParams()
  if (year) {
    searchParams.set("year", year)
  }
  const query = searchParams.toString()
  const response = await fetch(`${baseUrl}/revenues/monthly${query ? `?${query}` : ""}`, { cache: "no-store" })
  const payload = await readJsonResponse<{ data: MonthlyRevenueItem[] }>(response)
  return payload.data
}
