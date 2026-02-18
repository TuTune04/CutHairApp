import { fetchAppointments, fetchAvailability, postAppointment, postExternalRevenue } from "./api/appointments"
import { fetchCustomers, fetchDailyRevenue, fetchMonthlyRevenue } from "./api/analytics"
import { fetchServices } from "./api/catalog"
import { createApiClient } from "./api/client"

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

export async function getAppointments(baseUrl: string): Promise<Appointment[]> {
  const client = createApiClient(baseUrl)
  return fetchAppointments(client)
}

export async function getCustomers(baseUrl: string): Promise<CustomerSummary[]> {
  const client = createApiClient(baseUrl)
  return fetchCustomers(client)
}

export async function getServices(baseUrl: string): Promise<ServiceItem[]> {
  const client = createApiClient(baseUrl)
  return fetchServices(client)
}

export async function getAvailability(
  baseUrl: string,
  date: string,
  durationMinutes: number
): Promise<string[]> {
  const client = createApiClient(baseUrl)
  return fetchAvailability(client, date, durationMinutes)
}

export async function createAppointment(baseUrl: string, payload: CreateAppointmentPayload): Promise<Appointment> {
  const client = createApiClient(baseUrl)
  return postAppointment(client, payload)
}

export async function createExternalRevenue(
  baseUrl: string,
  payload: CreateExternalRevenuePayload
): Promise<Appointment> {
  const client = createApiClient(baseUrl)
  return postExternalRevenue(client, payload)
}

export async function getDailyRevenue(
  baseUrl: string,
  fromDate?: string,
  toDate?: string
): Promise<DailyRevenueItem[]> {
  const client = createApiClient(baseUrl)
  return fetchDailyRevenue(client, fromDate, toDate)
}

export async function getMonthlyRevenue(baseUrl: string, year?: string): Promise<MonthlyRevenueItem[]> {
  const client = createApiClient(baseUrl)
  return fetchMonthlyRevenue(client, year)
}
