"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Appointment,
  CustomerSummary,
  DailyRevenueItem,
  MonthlyRevenueItem,
  ServiceItem,
  createAppointment,
  createExternalRevenue,
  getAppointments,
  getCustomers,
  getDailyRevenue,
  getMonthlyRevenue,
  getServices,
} from "@/src/lib/booking-api"
import { AdminHeader } from "@/src/components/admin/admin-header"
import { AdminStatsCards } from "@/src/components/admin/admin-stats-cards"
import { AppointmentModal } from "@/src/components/admin/appointment-modal"
import { ExternalRevenueModal } from "@/src/components/admin/external-revenue-modal"
import { SchedulePanel } from "@/src/components/admin/schedule-panel"
import { AppointmentsTable } from "@/src/components/admin/appointments-table"
import { RevenuePanels } from "@/src/components/admin/revenue-panels"
import { CustomersPanel } from "@/src/components/admin/customers-panel"
import { PlusCircle } from "lucide-react"

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

function parseMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
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
  const [apiUrl, setApiUrl] = useState(defaultApiUrl)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenueItem[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueItem[]>([])

  const [revenueFromDate, setRevenueFromDate] = useState(todayISODate())
  const [revenueToDate, setRevenueToDate] = useState(todayISODate())
  const [revenueYear, setRevenueYear] = useState(currentYearText())

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [searchText, setSearchText] = useState("")
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("all")
  const [selectedDateFilter, setSelectedDateFilter] = useState(todayISODate())

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isExternalRevenueModalOpen, setIsExternalRevenueModalOpen] = useState(false)

  const filteredAppointments = useMemo(() => {
    const search = searchText.trim().toLowerCase()
    return appointments
      .filter((appointment) => {
        const matchDate = selectedDateFilter ? appointment.date === selectedDateFilter : true
        const matchService = selectedServiceFilter === "all" ? true : appointment.serviceName === selectedServiceFilter
        const matchSearch =
          search.length === 0
            ? true
            : `${appointment.customerName} ${appointment.phoneNumber} ${appointment.serviceName}`.toLowerCase().includes(search)
        return matchDate && matchService && matchSearch
      })
      .sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime))
  }, [appointments, searchText, selectedDateFilter, selectedServiceFilter])

  const totalAppointments = appointments.length
  const totalCustomers = customers.length
  const dailyRevenueTotal = dailyRevenue.reduce((sum, item) => sum + item.totalRevenue, 0)
  const monthlyRevenueTotal = monthlyRevenue.reduce((sum, item) => sum + item.totalRevenue, 0)

  async function loadDashboard(showMessage = true) {
    setError("")
    if (showMessage) {
      setMessage("")
    }
    setIsLoading(true)

    try {
      const [nextAppointments, nextCustomers, nextServices, nextDailyRevenue, nextMonthlyRevenue] = await Promise.all([
        getAppointments(apiUrl),
        getCustomers(apiUrl),
        getServices(apiUrl),
        getDailyRevenue(apiUrl, revenueFromDate, revenueToDate),
        getMonthlyRevenue(apiUrl, revenueYear),
      ])

      setAppointments(nextAppointments)
      setCustomers(nextCustomers)
      setServices(nextServices)
      setDailyRevenue(nextDailyRevenue)
      setMonthlyRevenue(nextMonthlyRevenue)

      if (showMessage) {
        setMessage("Da dong bo du lieu moi nhat")
      }
    } catch (loadError) {
      const text = loadError instanceof Error ? loadError.message : "Khong the tai du lieu"
      setError(text)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard(false)
    // Intentionally load once on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleRefreshRevenue() {
    setError("")
    setMessage("")
    setIsLoading(true)
    try {
      const [nextDaily, nextMonthly] = await Promise.all([
        getDailyRevenue(apiUrl, revenueFromDate, revenueToDate),
        getMonthlyRevenue(apiUrl, revenueYear),
      ])
      setDailyRevenue(nextDaily)
      setMonthlyRevenue(nextMonthly)
      setMessage("Da cap nhat bang doanh thu")
    } catch (loadError) {
      const text = loadError instanceof Error ? loadError.message : "Khong the tai doanh thu"
      setError(text)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateAppointment(payload: {
    customerName: string
    phoneNumber: string
    serviceName: string
    date: string
    startTime: string
    durationMinutes: number
    notes?: string
  }) {
    setError("")
    setMessage("")
    setIsLoading(true)
    try {
      await createAppointment(apiUrl, payload)
      setMessage("Tao lich hen thanh cong")
      await loadDashboard(false)
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Khong the tao lich hen"
      setError(text)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateExternalRevenue(payload: {
    customerName?: string
    phoneNumber: string
    date: string
    serviceNames: string[]
    totalRevenue?: number
    notes?: string
  }) {
    setError("")
    setMessage("")
    setIsLoading(true)
    try {
      await createExternalRevenue(apiUrl, payload)
      setMessage("Da ghi nhan doanh thu don ngoai")
      await loadDashboard(false)
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Khong the ghi nhan don ngoai"
      setError(text)
    } finally {
      setIsLoading(false)
    }
  }

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
          onRefresh={handleRefreshRevenue}
          formatCurrency={formatCurrency}
        />

        <CustomersPanel customers={customers} formatVnDateTime={formatVnDateTime} />
      </div>

      <AppointmentModal
        open={isAppointmentModalOpen}
        services={services}
        isLoading={isLoading}
        defaultDate={todayISODate()}
        timeSlots={TIME_SLOTS}
        durationOptions={DURATION_OPTIONS}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleCreateAppointment}
      />
      <ExternalRevenueModal
        open={isExternalRevenueModalOpen}
        services={services}
        defaultDate={todayISODate()}
        isLoading={isLoading}
        onClose={() => setIsExternalRevenueModalOpen(false)}
        onSubmit={handleCreateExternalRevenue}
      />
    </main>
  )
}
