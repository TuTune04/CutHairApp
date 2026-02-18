"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, Sparkles } from "lucide-react"
import Image from "next/image"
import { hairstylesByGender } from "@/src/data/hairstyles"
import type { HairGender, HairStyleOption } from "@/src/types/catalog"
import { createAppointment, getServices, ServiceItem } from "@/src/lib/booking-api"
import type { AppNotice } from "@/src/lib/notice"
import { buildApiErrorNotice, buildSuccessNotice } from "@/src/lib/notice"
import { InlineNotice } from "@/src/components/common/inline-notice"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  const [gender, setGender] = useState<HairGender | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [services, setServices] = useState<ServiceItem[]>([])
  const [bookingNotice, setBookingNotice] = useState<AppNotice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    serviceName: "",
    notes: "",
  })

  const hairstyles = gender ? hairstylesByGender[gender] : []
  const maleHairstyles = hairstylesByGender.male
  const femaleHairstyles = hairstylesByGender.female
  const selectedHairstyle = hairstyles.find((s) => s.id === selectedStyle)
  const selectedService = useMemo(
    () => services.find((service) => service.name === formData.serviceName),
    [services, formData.serviceName]
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let active = true
    setBookingNotice(null)

    getServices(apiBaseUrl)
      .then((items) => {
        if (!active) {
          return
        }
        setServices(items)
        setFormData((previous) => ({
          ...previous,
          serviceName: previous.serviceName || items[0]?.name || "",
        }))
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }
        setBookingNotice(
          buildApiErrorNotice(error, {
            fallbackTitle: "Khong tai duoc danh sach dich vu"
          })
        )
      })

    return () => {
      active = false
    }
  }, [isOpen, apiBaseUrl])

  const handleStyleHover = (style: HairStyleOption) => {
    setSelectedStyle(style.id)
    setPreviewImage(style.image)
  }

  const handleSelectStyle = (style: HairStyleOption) => {
    setSelectedStyle(style.id)
    setPreviewImage(style.image)
  }

  const handleTryHairstyle = () => {
    console.log("[v0] Try hairstyle clicked for:", selectedStyle)
    // Future deepface integration will go here
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingNotice(null)

    if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time || !formData.serviceName) {
      setBookingNotice({
        variant: "warning",
        title: "Thieu thong tin bat buoc",
        message: "Vui long nhap day du ten, so dien thoai, dich vu va thoi gian dat lich."
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createAppointment(apiBaseUrl, {
        customerName: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        serviceName: formData.serviceName,
        date: formData.date,
        startTime: formData.time,
        durationMinutes: selectedService?.defaultDurationMinutes ?? 60,
        notes: formData.notes.trim() || undefined,
      })

      setBookingNotice(buildSuccessNotice("Dat lich thanh cong", `Hen gap ban luc ${formData.time}, ngay ${formData.date}.`))
      setFormData((previous) => ({
        ...previous,
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: "",
      }))
    } catch (error: unknown) {
      setBookingNotice(
        buildApiErrorNotice(error, {
          validationTitle: "Thong tin dat lich chua dung",
          fallbackTitle: "Dat lich that bai"
        })
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden bg-white">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">Đặt lịch hẹn</h2>
                  <p className="mt-1 text-xs text-gray-500">Chọn kiểu tóc và điền thông tin</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 pb-28">
                {!gender ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-center"
                  >
                    <button
                      onClick={() => {
                        setGender("male")
                        setSelectedStyle(maleHairstyles[0].id)
                        setPreviewImage(maleHairstyles[0].image)
                      }}
                      className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-600">
                        <span className="text-lg text-blue-700 transition-colors group-hover:text-white">♂</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Cắt tóc nam</span>
                    </button>
                    <button
                      onClick={() => {
                        setGender("female")
                        setSelectedStyle(femaleHairstyles[0].id)
                        setPreviewImage(femaleHairstyles[0].image)
                      }}
                      className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 transition-colors group-hover:bg-pink-600">
                        <span className="text-lg text-pink-700 transition-colors group-hover:text-white">♀</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Cắt tóc nữ</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Main content - 3 column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Large Preview */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Xem trước</h3>
                        <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          {previewImage ? (
                            <Image
                              src={previewImage || "/placeholder.svg"}
                              alt="Xem trước kiểu tóc"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <User className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle: Hairstyle Selection & Info */}
                      <div className="lg:col-span-1 space-y-4">
                        {/* Style Selection */}
                        <div>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Chọn kiểu tóc
                          </h3>
                          <div className="grid grid-cols-5 gap-2">
                            {hairstyles.map((style) => (
                              <motion.button
                                key={style.id}
                                onHoverStart={() => handleStyleHover(style)}
                                onClick={() => handleSelectStyle(style)}
                                className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all group ${
                                  selectedStyle === style.id
                                    ? "border-black shadow-lg"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <Image
                                  src={style.image || "/placeholder.svg"}
                                  alt={style.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center p-1">
                                  <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-center line-clamp-1">
                                    {style.name}
                                  </span>
                                </div>
                                {selectedStyle === style.id && (
                                  <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full" />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {selectedHairstyle && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3 pt-2 border-t border-gray-200"
                          >
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Mô tả
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">{selectedHairstyle.description}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Dáng mặt phù hợp
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {selectedHairstyle.faceShapes.map((shape) => (
                                  <span
                                    key={shape}
                                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {shape}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Thời gian ước tính
                              </p>
                              <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {selectedHairstyle.estimatedTime} phút
                              </p>
                            </div>

                            <button
                              onClick={handleTryHairstyle}
                              className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              Thử kiểu tóc
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {/* Right: Form */}
                      <form id="booking-form" onSubmit={handleSubmit} className="lg:col-span-1 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                          Thông tin của bạn
                        </h3>

                        {/* Name */}
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-gray-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm placeholder-gray-400"
                            placeholder="Họ và tên"
                          />
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-gray-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm placeholder-gray-400"
                            placeholder="Email (khong bat buoc)"
                          />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-gray-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm placeholder-gray-400"
                            placeholder="Số điện thoại"
                          />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                </div>
                                <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full min-h-[42px] rounded-lg border border-gray-200 py-2 pl-10 pr-2 text-[16px] sm:text-sm focus:border-black focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                <Clock className="w-4 h-4" />
                                </div>
                                <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                step={1800}
                                className="w-full min-h-[42px] rounded-lg border border-gray-200 py-2 pl-10 pr-2 text-[16px] sm:text-sm focus:border-black focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Service */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ten dich vu</p>
                            <select
                              required
                              value={formData.serviceName}
                              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none transition-colors"
                            >
                              <option value="">Chon dich vu</option>
                              {services.map((service) => (
                                <option key={service.id} value={service.name}>
                                  {service.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gia dich vu</p>
                            <span className="flex min-h-[42px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-800">
                              {selectedService?.priceText ?? "--"}
                            </span>
                          </div>
                        </div>

                        {bookingNotice ? <InlineNotice notice={bookingNotice} /> : null}


                        {/* Notes */}
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm placeholder-gray-400 resize-none"
                            rows={2}
                            placeholder="Ghi chú"
                          />
                        </div>

                      </form>
                    </div>
                  </motion.div>
                )}
              </div>

              {gender && (
                <div className="sticky bottom-0 z-20 border-t border-gray-100 bg-white/95 px-8 py-4 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGender(null)
                        setSelectedStyle(null)
                        setPreviewImage("")
                      }}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      form="booking-form"
                      disabled={isSubmitting}
                      className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Dang dat..." : "Dat lich"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
