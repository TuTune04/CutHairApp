"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { AdminStatsCards } from "@/src/components/admin/admin-stats-cards"
import { AppointmentModal } from "@/src/components/admin/appointment-modal"
import { ExternalRevenueModal } from "@/src/components/admin/external-revenue-modal"
import { SchedulePanel } from "@/src/components/admin/schedule-panel"
import { AppointmentsTable } from "@/src/components/admin/appointments-table"
import { RevenuePanels } from "@/src/components/admin/revenue-panels"
import { CustomersPanel } from "@/src/components/admin/customers-panel"
import { PlusCircle } from "lucide-react"
import { useAdminDashboardController } from "@/src/features/admin/useAdminDashboardController"

function todayISODate() {
  return new Date().toISOString().slice(0, 10)
}

function currentYearText() {
  return String(new Date().getFullYear())
}

function formatVnDateTime(isoText: string) {
  const asDate = new Date(isoText)
  if (Number.isNaN(asDate.getTime())) {
    return isoText
  }
  return asDate.toLocaleString("vi-VN")
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount)
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

const DURATION_OPTIONS = [30, 45, 60, 90, 120]

export default function AdminBookingPage() {
  const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  const today = todayISODate()
  const currentYear = currentYearText()
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isExternalRevenueModalOpen, setIsExternalRevenueModalOpen] = useState(false)
  const {
    apiUrl,
    setApiUrl,
    isLoading,
    message,
    error,
    appointments,
    customers,
    services,
    dailyRevenue,
    monthlyRevenue,
    revenueFromDate,
    setRevenueFromDate,
    revenueToDate,
    setRevenueToDate,
    revenueYear,
    setRevenueYear,
    searchText,
    setSearchText,
    selectedServiceFilter,
    setSelectedServiceFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    filteredAppointments,
    loadDashboard,
    refreshRevenue,
    submitAppointment,
    submitExternalRevenue
  } = useAdminDashboardController(defaultApiUrl, today, currentYear)

  const totalAppointments = appointments.length
  const totalCustomers = customers.length
  const dailyRevenueTotal = dailyRevenue.reduce((sum, item) => sum + item.totalRevenue, 0)
  const monthlyRevenueTotal = monthlyRevenue.reduce((sum, item) => sum + item.totalRevenue, 0)

  useEffect(() => {
    void loadDashboard(false)
    // Intentionally load once on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-neutral-50 px-3 py-6 text-neutral-900 md:px-6">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-4">
        <AdminHeader
          apiUrl={apiUrl}
          isLoading={isLoading}
          message={message}
          error={error}
          onApiUrlChange={setApiUrl}
          onRefresh={() => void loadDashboard(true)}
        />

        <AdminStatsCards
          totalAppointments={totalAppointments}
          totalCustomers={totalCustomers}
          dailyRevenueTotalText={formatCurrency(dailyRevenueTotal)}
          monthlyRevenueTotalText={formatCurrency(monthlyRevenueTotal)}
        />

        <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Them lich hen
            </button>
            <button
              type="button"
              onClick={() => setIsExternalRevenueModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Ghi nhan don ngoai
            </button>
          </div>
        </section>

        <SchedulePanel
          timeSlots={TIME_SLOTS}
          services={services}
          searchText={searchText}
          selectedDateFilter={selectedDateFilter}
          selectedServiceFilter={selectedServiceFilter}
          filteredAppointments={filteredAppointments}
          onSearchTextChange={setSearchText}
          onDateFilterChange={setSelectedDateFilter}
          onServiceFilterChange={setSelectedServiceFilter}
        />

        <AppointmentsTable appointments={filteredAppointments} formatCurrency={formatCurrency} />

        <RevenuePanels
          dailyRevenue={dailyRevenue}
          monthlyRevenue={monthlyRevenue}
          revenueFromDate={revenueFromDate}
          revenueToDate={revenueToDate}
          revenueYear={revenueYear}
          isLoading={isLoading}
          onFromDateChange={setRevenueFromDate}
          onToDateChange={setRevenueToDate}
          onYearChange={setRevenueYear}
          onRefresh={refreshRevenue}
          formatCurrency={formatCurrency}
        />

        <CustomersPanel customers={customers} formatVnDateTime={formatVnDateTime} />
      </div>

      <AppointmentModal
        open={isAppointmentModalOpen}
        services={services}
        isLoading={isLoading}
        defaultDate={today}
        timeSlots={TIME_SLOTS}
        durationOptions={DURATION_OPTIONS}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={submitAppointment}
      />
      <ExternalRevenueModal
        open={isExternalRevenueModalOpen}
        services={services}
        defaultDate={today}
        isLoading={isLoading}
        onClose={() => setIsExternalRevenueModalOpen(false)}
        onSubmit={submitExternalRevenue}
      />
    </main>
  )
}
