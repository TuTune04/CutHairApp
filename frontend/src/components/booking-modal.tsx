"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, Sparkles } from "lucide-react"
import Image from "next/image"

interface HairstyleOption {
  id: string
  name: string
  image: string
  description: string
  faceShapes: string[]
  estimatedTime: number // in minutes
}

const maleHairstyles: HairstyleOption[] = [
  {
    id: "fade",
    name: "Fade Cut",
    image: "/images/tocnam1.jpg",
    description: "Classic fade with clean lines, perfect for a polished professional look.",
    faceShapes: ["Oval", "Square", "Rectangle"],
    estimatedTime: 30,
  },
  {
    id: "undercut",
    name: "Undercut",
    image: "/images/tocnam2.jpg",
    description: "Bold contrast between short sides and longer top, versatile styling options.",
    faceShapes: ["Round", "Oval", "Square"],
    estimatedTime: 35,
  },
  {
    id: "pompadour",
    name: "Pompadour",
    image: "/images/tocnam3.jpg",
    description: "Vintage-inspired style with volume on top, requires regular maintenance.",
    faceShapes: ["Oval", "Rectangle", "Diamond"],
    estimatedTime: 40,
  },
  {
    id: "crew",
    name: "Crew Cut",
    image: "/images/tocnam4.jpg",
    description: "Short and neat, low maintenance classic that suits most face shapes.",
    faceShapes: ["All"],
    estimatedTime: 25,
  },
  {
    id: "textured",
    name: "Textured",
    image: "/images/tocnu1.jpg",
    description: "Modern textured cut with movement, great for casual and formal settings.",
    faceShapes: ["Oval", "Square", "Round"],
    estimatedTime: 35,
  },
]

const femaleHairstyles: HairstyleOption[] = [
  {
    id: "bob",
    name: "Bob Cut",
    image: "/images/tocnu2.jpg",
    description: "Timeless bob with clean lines, flattering and easy to style.",
    faceShapes: ["Oval", "Square", "Heart"],
    estimatedTime: 45,
  },
  {
    id: "layers",
    name: "Layered",
    image: "/images/tocnu3.jpg",
    description: "Textured layers add movement and volume, perfect for all hair types.",
    faceShapes: ["Round", "Oval", "Rectangle"],
    estimatedTime: 50,
  },
  {
    id: "waves",
    name: "Waves",
    image: "/images/tocnu4.jpg",
    description: "Soft waves for a romantic, effortless look with natural movement.",
    faceShapes: ["All"],
    estimatedTime: 55,
  },
  {
    id: "pixie",
    name: "Pixie Cut",
    image: "/images/tocnu5.jpg",
    description: "Short and chic, bold statement cut that requires minimal styling.",
    faceShapes: ["Oval", "Heart", "Diamond"],
    estimatedTime: 35,
  },
  {
    id: "long",
    name: "Long Hair",
    image: "/images/tocnu6.jpg",
    description: "Flowing long hair with subtle layers for dimension and elegance.",
    faceShapes: ["All"],
    estimatedTime: 60,
  },
]

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [gender, setGender] = useState<"male" | "female" | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  })

  const hairstyles = gender === "male" ? maleHairstyles : femaleHairstyles
  const selectedHairstyle = hairstyles.find((s) => s.id === selectedStyle)

  const handleStyleHover = (style: HairstyleOption) => {
    setSelectedStyle(style.id)
    setPreviewImage(style.image)
  }

  const handleTryHairstyle = () => {
    console.log("[v0] Try hairstyle clicked for:", selectedStyle)
    // Future deepface integration will go here
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", { gender, selectedStyle, ...formData })
    onClose()
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
            <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">Book Appointment</h2>
                  <p className="text-xs text-gray-500 mt-1">Select style and confirm details</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {!gender ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-center"
                  >
                    <button
                      onClick={() => setGender("male")}
                      className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-black transition-colors flex items-center justify-center">
                        <span className="text-lg group-hover:text-white transition-colors">♂</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Men's Cut</span>
                    </button>
                    <button
                      onClick={() => setGender("female")}
                      className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-black transition-colors flex items-center justify-center">
                        <span className="text-lg group-hover:text-white transition-colors">♀</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Women's Cut</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Back button */}
                    <button
                      onClick={() => {
                        setGender(null)
                        setSelectedStyle(null)
                        setPreviewImage("")
                      }}
                      className="text-xs font-semibold text-gray-500 hover:text-black transition-colors uppercase tracking-wide"
                    >
                      ← Back
                    </button>

                    {/* Main content - 3 column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Large Preview */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview</h3>
                        <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          {previewImage ? (
                            <Image
                              src={previewImage || "/placeholder.svg"}
                              alt="Hairstyle preview"
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
                            Choose Style
                          </h3>
                          <div className="grid grid-cols-5 gap-2">
                            {hairstyles.map((style) => (
                              <motion.button
                                key={style.id}
                                onHoverStart={() => handleStyleHover(style)}
                                onClick={() => setSelectedStyle(style.id)}
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
                                Description
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">{selectedHairstyle.description}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Best For Face Shapes
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
                                Estimated Time
                              </p>
                              <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {selectedHairstyle.estimatedTime} minutes
                              </p>
                            </div>

                            <button
                              onClick={handleTryHairstyle}
                              className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              Try Hairstyle
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {/* Right: Form */}
                      <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                          Your Details
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
                            placeholder="Full name"
                          />
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-gray-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm placeholder-gray-400"
                            placeholder="Email"
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
                            placeholder="Phone"
                          />
                        </div>

                        {/* Date & Time in row */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> */}
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                </div>
                                <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm"
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
                                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        {/* </div> */}


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
                            placeholder="Notes"
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setGender(null)
                              setSelectedStyle(null)
                              setPreviewImage("")
                            }}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
