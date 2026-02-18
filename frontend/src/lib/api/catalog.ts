import type { ApiClient } from "./client";
import type { ServiceItem } from "../booking-api";

export async function fetchServices(client: ApiClient): Promise<ServiceItem[]> {
  const payload = await client.get<{ data: ServiceItem[] }>("/services");
  return payload.data;
}
