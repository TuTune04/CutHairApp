"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { ServiceItem } from "@/src/lib/booking-api"
import { AdminModal } from "@/src/components/admin/admin-modal"

interface AppointmentModalPayload {
  customerName: string
  phoneNumber: string
  serviceName: string
  date: string
  startTime: string
  durationMinutes: number
  notes?: string
}

interface AppointmentModalProps {
  open: boolean
  services: ServiceItem[]
  isLoading: boolean
  defaultDate: string
  timeSlots: string[]
  durationOptions: number[]
  onClose: () => void
  onSubmit: (payload: AppointmentModalPayload) => Promise<void> | void
}

export function AppointmentModal({
  open,
  services,
  isLoading,
  defaultDate,
  timeSlots,
  durationOptions,
  onClose,
  onSubmit,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    serviceName: "",
    date: defaultDate,
    startTime: "09:00",
    durationMinutes: 60,
    notes: "",
  })

  useEffect(() => {
    if (!open) {
      return
    }
    setFormData((prev) => ({
      ...prev,
      date: defaultDate,
      serviceName: prev.serviceName || services[0]?.name || "",
      durationMinutes: prev.durationMinutes || services[0]?.defaultDurationMinutes || 60,
    }))
  }, [open, services, defaultDate])

  const selectedService = useMemo(
    () => services.find((service) => service.name === formData.serviceName),
    [services, formData.serviceName]
  )

  const canSubmit =
    formData.customerName.trim().length >= 2 &&
    formData.phoneNumber.trim().length >= 8 &&
    formData.serviceName.trim().length > 0 &&
    formData.date.length > 0 &&
    formData.startTime.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    await onSubmit({
      customerName: formData.customerName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      serviceName: formData.serviceName.trim(),
      date: formData.date,
      startTime: formData.startTime,
      durationMinutes: selectedService?.defaultDurationMinutes ?? formData.durationMinutes,
      notes: formData.notes.trim() || undefined,
    })

    setFormData((prev) => ({
      ...prev,
      customerName: "",
      phoneNumber: "",
      notes: "",
    }))
    onClose()
  }

  return (
    <AdminModal open={open} title="Them lich hen" subtitle="Dung cho lich hen dat qua app" onClose={onClose}>
      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <input
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Ten khach hang"
          value={formData.customerName}
          onChange={(event) => setFormData((prev) => ({ ...prev, customerName: event.target.value }))}
        />
        <input
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="So dien thoai"
          value={formData.phoneNumber}
          onChange={(event) => setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))}
        />
        <select
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          value={formData.serviceName}
          onChange={(event) => {
            const selected = services.find((service) => service.name === event.target.value)
            setFormData((prev) => ({
              ...prev,
              serviceName: event.target.value,
              durationMinutes: selected?.defaultDurationMinutes ?? prev.durationMinutes,
            }))
          }}
        >
          <option value="">Chon dich vu</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name} - {service.priceText}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            type="date"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={formData.date}
            onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
          />
          <select
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            value={formData.startTime}
            onChange={(event) => setFormData((prev) => ({ ...prev, startTime: event.target.value }))}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <select
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          value={formData.durationMinutes}
          onChange={(event) => setFormData((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))}
        >
          {durationOptions.map((duration) => (
            <option key={duration} value={duration}>
              {duration} phut
            </option>
          ))}
        </select>
        <textarea
          className="min-h-20 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Ghi chu"
          value={formData.notes}
          onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
        />
        <button
          type="submit"
          disabled={isLoading || !canSubmit}
          className="w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Dang luu..." : "Luu lich hen"}
        </button>
      </form>
    </AdminModal>
  )
}
