import type { ApiClient } from "./client";
import type { CustomerSummary, DailyRevenueItem, MonthlyRevenueItem } from "../booking-api";

export async function fetchCustomers(client: ApiClient): Promise<CustomerSummary[]> {
  const payload = await client.get<{ data: CustomerSummary[] }>("/customers");
  return payload.data;
}

export async function fetchDailyRevenue(client: ApiClient, fromDate?: string, toDate?: string): Promise<DailyRevenueItem[]> {
  const searchParams = new URLSearchParams();
  if (fromDate) searchParams.set("from", fromDate);
  if (toDate) searchParams.set("to", toDate);
  const query = searchParams.toString();
  const payload = await client.get<{ data: DailyRevenueItem[] }>(`/revenues/daily${query ? `?${query}` : ""}`);
  return payload.data;
}

export async function fetchMonthlyRevenue(client: ApiClient, year?: string): Promise<MonthlyRevenueItem[]> {
  const searchParams = new URLSearchParams();
  if (year) searchParams.set("year", year);
  const query = searchParams.toString();
  const payload = await client.get<{ data: MonthlyRevenueItem[] }>(`/revenues/monthly${query ? `?${query}` : ""}`);
  return payload.data;
}
