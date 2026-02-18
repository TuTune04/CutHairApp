"use client"

import { DailyRevenueItem, MonthlyRevenueItem } from "@/src/lib/booking-api"

interface RevenuePanelsProps {
  dailyRevenue: DailyRevenueItem[]
  monthlyRevenue: MonthlyRevenueItem[]
  revenueFromDate: string
  revenueToDate: string
  revenueYear: string
  isLoading: boolean
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onYearChange: (value: string) => void
  onRefresh: () => void
  formatCurrency: (amount: number) => string
}

export function RevenuePanels({
  dailyRevenue,
  monthlyRevenue,
  revenueFromDate,
  revenueToDate,
  revenueYear,
  isLoading,
  onFromDateChange,
  onToDateChange,
  onYearChange,
  onRefresh,
  formatCurrency,
}: RevenuePanelsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Doanh thu theo ngay</h3>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <input
            type="date"
            className="rounded-lg border border-neutral-300 px-2 py-2 text-xs"
            value={revenueFromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
          />
          <input
            type="date"
            className="rounded-lg border border-neutral-300 px-2 py-2 text-xs"
            value={revenueToDate}
            onChange={(event) => onToDateChange(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="mb-3 w-full rounded-lg border border-neutral-300 px-2 py-2 text-xs hover:bg-neutral-100"
          onClick={onRefresh}
          disabled={isLoading}
        >
          Tai bang doanh thu
        </button>
        <div className="max-h-[260px] overflow-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-neutral-100 text-neutral-700">
              <tr>
                <th className="px-2 py-2">Ngay</th>
                <th className="px-2 py-2 text-right">Tong</th>
                <th className="px-2 py-2 text-right">App</th>
                <th className="px-2 py-2 text-right">Ngoai</th>
              </tr>
            </thead>
            <tbody>
              {dailyRevenue.map((item) => (
                <tr key={item.date} className="border-t border-neutral-100">
                  <td className="px-2 py-1.5">{item.date}</td>
                  <td className="px-2 py-1.5 text-right">{formatCurrency(item.totalRevenue)}</td>
                  <td className="px-2 py-1.5 text-right">{item.appOrders}</td>
                  <td className="px-2 py-1.5 text-right">{item.externalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Tong ket doanh thu thang</h3>
        <div className="mb-2 flex gap-2">
          <input
            className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-xs"
            value={revenueYear}
            onChange={(event) => onYearChange(event.target.value)}
            placeholder="YYYY"
          />
          <button
            type="button"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-xs hover:bg-neutral-100"
            onClick={onRefresh}
            disabled={isLoading}
          >
            Loc
          </button>
        </div>
        <div className="max-h-[260px] overflow-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-neutral-100 text-neutral-700">
              <tr>
                <th className="px-2 py-2">Thang</th>
                <th className="px-2 py-2 text-right">So don</th>
                <th className="px-2 py-2 text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map((item) => (
                <tr key={item.month} className="border-t border-neutral-100">
                  <td className="px-2 py-1.5">{item.month}</td>
                  <td className="px-2 py-1.5 text-right">{item.totalAppointments}</td>
                  <td className="px-2 py-1.5 text-right">{formatCurrency(item.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
