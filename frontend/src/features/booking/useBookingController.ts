"use client"

import { useEffect, useState } from "react"
import { createAppointment, getServices, type CreateAppointmentPayload, type ServiceItem } from "@/src/lib/booking-api"
import { buildApiErrorNotice, buildSuccessNotice, type AppNotice } from "@/src/lib/notice"

export function useBookingController(baseUrl: string, isOpen: boolean) {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [notice, setNotice] = useState<AppNotice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let active = true
    setNotice(null)
    getServices(baseUrl)
      .then((rows) => {
        if (active) setServices(rows)
      })
      .catch((error: unknown) => {
        if (!active) return
        setNotice(
          buildApiErrorNotice(error, {
            fallbackTitle: "Khong tai duoc danh sach dich vu"
          })
        )
      })

    return () => {
      active = false
    }
  }, [baseUrl, isOpen])

  async function submitBooking(payload: CreateAppointmentPayload): Promise<boolean> {
    setNotice(null)
    setIsSubmitting(true)
    try {
      await createAppointment(baseUrl, payload)
      setNotice(buildSuccessNotice("Dat lich thanh cong", `Hen gap ban luc ${payload.startTime}, ngay ${payload.date}.`))
      return true
    } catch (error: unknown) {
      setNotice(
        buildApiErrorNotice(error, {
          validationTitle: "Thong tin dat lich chua dung",
          fallbackTitle: "Dat lich that bai"
        })
      )
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    services,
    notice,
    setNotice,
    isSubmitting,
    submitBooking
  }
}
