export type ServiceCategory = "Dich vu le" | "Hoa chat" | "Phuc hoi";

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  priceText: string;
  basePriceAmount: number;
  defaultDurationMinutes: number;
}

export interface UpdateServiceInput {
  name?: string;
  category?: ServiceCategory;
  priceText?: string;
  basePriceAmount?: number;
  defaultDurationMinutes?: number;
}
