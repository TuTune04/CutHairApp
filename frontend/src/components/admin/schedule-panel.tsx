"use client"

import { Appointment, ServiceItem } from "@/src/lib/booking-api"
import { Search } from "lucide-react"

interface SchedulePanelProps {
  timeSlots: string[]
  services: ServiceItem[]
  searchText: string
  selectedDateFilter: string
  selectedServiceFilter: string
  filteredAppointments: Appointment[]
  onSearchTextChange: (value: string) => void
  onDateFilterChange: (value: string) => void
  onServiceFilterChange: (value: string) => void
}

function parseMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

function getTimelineData(timeSlots: string[], appointments: Appointment[]) {
  return timeSlots.map((slot) => {
    const slotStart = parseMinutes(slot)
    const slotEnd = slotStart + 30
    const rows = appointments.filter((appointment) => {
      if (appointment.source !== "app") {
        return false
      }
      const bookingStart = parseMinutes(appointment.startTime)
      const bookingEnd = parseMinutes(appointment.endTime)
      return bookingStart < slotEnd && slotStart < bookingEnd
    })
    return { slot, rows }
  })
}

export function SchedulePanel({
  timeSlots,
  services,
  searchText,
  selectedDateFilter,
  selectedServiceFilter,
  filteredAppointments,
  onSearchTextChange,
  onDateFilterChange,
  onServiceFilterChange,
}: SchedulePanelProps) {
  const timelineData = getTimelineData(timeSlots, filteredAppointments)

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-semibold">Lich bieu theo khung gio</h2>
        <div className="flex flex-1 flex-col gap-2 md:flex-row lg:max-w-3xl">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm"
              placeholder="Tim ten, so dien thoai, dich vu"
              value={searchText}
              onChange={(event) => onSearchTextChange(event.target.value)}
            />
          </div>
          <input
            type="date"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={selectedDateFilter}
            onChange={(event) => onDateFilterChange(event.target.value)}
          />
          <select
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={selectedServiceFilter}
            onChange={(event) => onServiceFilterChange(event.target.value)}
          >
            <option value="all">Tat ca dich vu</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid max-h-[470px] grid-cols-[74px_1fr] overflow-auto rounded-lg border border-neutral-200">
        {timelineData.map((row) => (
          <div key={row.slot} className="contents">
            <div className="border-b border-r border-neutral-200 bg-neutral-50 px-2 py-2 text-xs font-medium text-neutral-600">
              {row.slot}
            </div>
            <div className="border-b border-neutral-200 px-2 py-2">
              {row.rows.length === 0 ? (
                <span className="text-xs text-neutral-400">Trong</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {row.rows.map((appointment) => (
                    <span key={`${row.slot}-${appointment.id}`} className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-800">
                      {appointment.startTime}-{appointment.endTime} {appointment.customerName} ({appointment.phoneNumber})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
