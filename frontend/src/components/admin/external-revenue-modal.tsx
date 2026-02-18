"use client"

import { FormEvent, useMemo, useState } from "react"
import { ServiceItem } from "@/src/lib/booking-api"
import { AdminModal } from "@/src/components/admin/admin-modal"

interface ExternalRevenuePayload {
  customerName?: string
  phoneNumber: string
  date: string
  serviceNames: string[]
  totalRevenue?: number
  notes?: string
}

interface ExternalRevenueModalProps {
  open: boolean
  services: ServiceItem[]
  defaultDate: string
  isLoading: boolean
  onClose: () => void
  onSubmit: (payload: ExternalRevenuePayload) => Promise<void> | void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount)
}

export function ExternalRevenueModal({
  open,
  services,
  defaultDate,
  isLoading,
  onClose,
  onSubmit,
}: ExternalRevenueModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    date: defaultDate,
    selectedServices: [] as string[],
    totalRevenue: "",
    notes: "",
  })

  const estimatedRevenue = useMemo(() => {
    const serviceTotal = formData.selectedServices.reduce((sum, serviceName) => {
      const service = services.find((item) => item.name === serviceName)
      return sum + (service?.basePriceAmount ?? 0)
    }, 0)

    if (formData.totalRevenue.trim()) {
      const custom = Number(formData.totalRevenue.replace(/[^\d]/g, ""))
      return Number.isNaN(custom) ? serviceTotal : custom
    }
    return serviceTotal
  }, [formData.selectedServices, formData.totalRevenue, services])

  const canSubmit = formData.phoneNumber.trim().length >= 8 && formData.selectedServices.length > 0

  function toggleService(serviceName: string) {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(serviceName)
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((item) => item !== serviceName)
          : [...prev.selectedServices, serviceName],
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    const normalizedRevenue = formData.totalRevenue.trim()
      ? Number(formData.totalRevenue.replace(/[^\d]/g, ""))
      : undefined

    await onSubmit({
      customerName: formData.customerName.trim() || undefined,
      phoneNumber: formData.phoneNumber.trim(),
      date: formData.date,
      serviceNames: formData.selectedServices,
      totalRevenue: normalizedRevenue,
      notes: formData.notes.trim() || undefined,
    })

    setFormData({
      customerName: "",
      phoneNumber: "",
      date: defaultDate,
      selectedServices: [],
      totalRevenue: "",
      notes: "",
    })
    onClose()
  }

  return (
    <AdminModal
      open={open}
      title="Ghi nhan don ngoai"
      subtitle="Muc tieu chinh: bo sung doanh thu trong ngay, cho phep nhieu dich vu"
      onClose={onClose}
    >
      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Ten khach (co the de trong)"
          value={formData.customerName}
          onChange={(event) => setFormData((prev) => ({ ...prev, customerName: event.target.value }))}
        />
        <input
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="So dien thoai (dinh danh)"
          value={formData.phoneNumber}
          onChange={(event) => setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))}
        />
        <input
          required
          type="date"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          value={formData.date}
          onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
        />

        <div className="rounded-lg border border-neutral-200 p-2">
          <p className="mb-2 text-xs font-medium text-neutral-600">Chon nhieu dich vu da su dung</p>
          <div className="max-h-36 space-y-1.5 overflow-auto">
            {services.map((service) => {
              const checked = formData.selectedServices.includes(service.name)
              return (
                <label key={service.id} className="flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-neutral-50">
                  <span className="text-xs">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">{service.priceText}</span>
                    <input type="checkbox" checked={checked} onChange={() => toggleService(service.name)} />
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        <input
          type="number"
          min={0}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Tong doanh thu (bo trong de tu tinh)"
          value={formData.totalRevenue}
          onChange={(event) => setFormData((prev) => ({ ...prev, totalRevenue: event.target.value }))}
        />
        <textarea
          className="min-h-16 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Ghi chu"
          value={formData.notes}
          onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
        />
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Tong doanh thu se ghi nhan: {formatCurrency(estimatedRevenue)}
        </div>
        <button
          type="submit"
          disabled={isLoading || !canSubmit}
          className="w-full rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Dang luu..." : "Luu don ngoai"}
        </button>
      </form>
    </AdminModal>
  )
}
