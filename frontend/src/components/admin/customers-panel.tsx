"use client"

import { CustomerSummary } from "@/src/lib/booking-api"

interface CustomersPanelProps {
  customers: CustomerSummary[]
  formatVnDateTime: (isoText: string) => string
}

export function CustomersPanel({ customers, formatVnDateTime }: CustomersPanelProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Khach hang (gop theo so dien thoai)</h2>
      <div className="max-h-[260px] overflow-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-neutral-100 text-neutral-700">
            <tr>
              <th className="px-2 py-2">Ten</th>
              <th className="px-2 py-2">SDT</th>
              <th className="px-2 py-2 text-right">So lan</th>
              <th className="px-2 py-2 text-right">Lan gan nhat</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.phoneNumber} className="border-t border-neutral-100">
                  <td className="px-2 py-1.5">{customer.customerName}</td>
                  <td className="px-2 py-1.5">{customer.phoneNumber}</td>
                  <td className="px-2 py-1.5 text-right">{customer.totalAppointments}</td>
                  <td className="px-2 py-1.5 text-right">{formatVnDateTime(customer.latestAppointmentAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-2 py-4 text-center text-neutral-500">
                  Chua co du lieu khach hang
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
