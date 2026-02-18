import type { ApiClient } from "./client";
import type { Appointment, CreateAppointmentPayload, CreateExternalRevenuePayload } from "../booking-api";

export async function fetchAppointments(client: ApiClient): Promise<Appointment[]> {
  const payload = await client.get<{ data: Appointment[] }>("/appointments");
  return payload.data;
}

export async function fetchAvailability(
  client: ApiClient,
  date: string,
  durationMinutes: number
): Promise<string[]> {
  const searchParams = new URLSearchParams({
    date,
    durationMinutes: String(durationMinutes)
  });
  const payload = await client.get<{ data: { date: string; freeSlots: string[] } }>(
    `/availability?${searchParams.toString()}`
  );
  return payload.data.freeSlots;
}

export async function postAppointment(client: ApiClient, body: CreateAppointmentPayload): Promise<Appointment> {
  const payload = await client.post<{ data: Appointment }>("/appointments", body);
  return payload.data;
}

export async function postExternalRevenue(client: ApiClient, body: CreateExternalRevenuePayload): Promise<Appointment> {
  const payload = await client.post<{ data: Appointment }>("/external-revenues", body);
  return payload.data;
}
