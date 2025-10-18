"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { PackageCheck, Rocket, ShieldCheck, X, Calendar, Clock, User, Phone, Mail } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"
import { useIsMobile } from "@/src/hooks/useIsMobile"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: ''
  })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]) // Reduced hero image shrink from 15% to 5%
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Booking data:', formData)
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ lại sớm nhất.')
    setIsBookingModalOpen(false)
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: ''
    })
  }

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
      <span>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.03,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Image with Cinematic Effects */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Image
          src="/images/herosection.jpeg"
          alt="KATACHI Studio - Elegant interior with sage green walls and terracotta furniture overlooking surreal landscape"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container-custom text-center text-white">
          <Reveal>
            <h1 className={`font-bold leading-none tracking-tight mb-6 ${
              isMobile 
                ? "text-4xl sm:text-5xl" 
                : "text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            }`}>
              <AnimatedText text="Premium hair styling" delay={0.5} />
              <br />
              <span className="italic font-light">
                <AnimatedText text="for every occasion." delay={1.1} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.p
              className={`text-white/90 mb-12 leading-relaxed ${
                isMobile ? "text-base" : "text-lg md:text-xl"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              Expert stylists, premium products, and personalized service.
            </motion.p>
          </Reveal>
        </div>
      </motion.div>

      {/* Info Strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <BlurPanel className={`mx-6 mb-6 bg-black/24 backdrop-blur-md border-white/20 ${
          isMobile ? "px-4 py-3" : "px-6 py-4"
        }`}>
          <div className={`flex items-center justify-center text-white/90 ${
            isMobile ? "gap-3 flex-wrap" : "gap-6"
          }`}>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-green-400" />
              <span className={isMobile ? "text-xs" : "text-sm"}>Expert Stylists</span>
            </div>
            <button 
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className={isMobile ? "text-xs" : "text-sm"}>Quick Booking</span>
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className={isMobile ? "text-xs" : "text-sm"}>Premium Products</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsBookingModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden ${
                isMobile ? "max-h-[100vh]" : "max-h-[120vh]"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>
                      Đặt Lịch Ngay
                    </h2>
                    <p className={`text-white/90 ${isMobile ? "text-sm" : "text-base"}`}>
                      Chúng tôi sẽ liên hệ lại sớm nhất
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập email (tùy chọn)"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <PackageCheck size={16} />
                    Dịch vụ *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn dịch vụ</option>
                    <option value="haircut">Cắt tóc</option>
                    <option value="coloring">Nhuộm tóc</option>
                    <option value="styling">Tạo kiểu</option>
                    <option value="treatment">Điều trị tóc</option>
                    <option value="consultation">Tư vấn</option>
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} />
                      Ngày *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} />
                      Giờ *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn giờ</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket size={20} />
                  Đặt Lịch Ngay
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
