"use client"

import { CalendarClock, ChartBar, Clock3, Users } from "lucide-react"

interface AdminStatsCardsProps {
  totalAppointments: number
  totalCustomers: number
  dailyRevenueTotalText: string
  monthlyRevenueTotalText: string
}

export function AdminStatsCards({
  totalAppointments,
  totalCustomers,
  dailyRevenueTotalText,
  monthlyRevenueTotalText,
}: AdminStatsCardsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-sm">Tong lich hen</span>
          <CalendarClock className="h-4 w-4" />
        </div>
        <p className="mt-2 text-2xl font-semibold">{totalAppointments}</p>
      </article>
      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-sm">Khach hang (SDT duy nhat)</span>
          <Users className="h-4 w-4" />
        </div>
        <p className="mt-2 text-2xl font-semibold">{totalCustomers}</p>
      </article>
      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-sm">Doanh thu ngay (loc)</span>
          <ChartBar className="h-4 w-4" />
        </div>
        <p className="mt-2 text-2xl font-semibold">{dailyRevenueTotalText}</p>
      </article>
      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-neutral-500">
          <span className="text-sm">Doanh thu thang (nam)</span>
          <Clock3 className="h-4 w-4" />
        </div>
        <p className="mt-2 text-2xl font-semibold">{monthlyRevenueTotalText}</p>
      </article>
    </section>
  )
}
