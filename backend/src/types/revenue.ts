export interface DailyRevenue {
  date: string;
  totalRevenue: number;
  totalAppointments: number;
  appOrders: number;
  externalOrders: number;
}

export interface MonthlyRevenue {
  month: string;
  totalRevenue: number;
  totalAppointments: number;
}
