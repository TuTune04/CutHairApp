"use client"

import { Appointment } from "@/src/lib/booking-api"

interface AppointmentsTableProps {
  appointments: Appointment[]
  formatCurrency: (amount: number) => string
}

export function AppointmentsTable({ appointments, formatCurrency }: AppointmentsTableProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Danh sach lich hen (compact)</h2>
      <div className="max-h-[380px] overflow-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-neutral-100 text-neutral-700">
            <tr>
              <th className="px-2 py-2">Khach</th>
              <th className="px-2 py-2">SDT</th>
              <th className="px-2 py-2">Dich vu</th>
              <th className="px-2 py-2">Gio</th>
              <th className="px-2 py-2">Nguon</th>
              <th className="px-2 py-2 text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-neutral-100">
                  <td className="px-2 py-1.5">{appointment.customerName}</td>
                  <td className="px-2 py-1.5">{appointment.phoneNumber}</td>
                  <td className="px-2 py-1.5">{appointment.serviceName}</td>
                  <td className="px-2 py-1.5">
                    {appointment.date} {appointment.startTime !== "00:00" ? `${appointment.startTime}-${appointment.endTime}` : ""}
                  </td>
                  <td className="px-2 py-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 ${
                        appointment.source === "external" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {appointment.source}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right">{formatCurrency(appointment.revenueAmount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-2 py-4 text-center text-neutral-500">
                  Khong co lich hen theo bo loc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
