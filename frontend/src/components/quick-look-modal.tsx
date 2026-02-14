"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BlurPanel } from "./blur-panel"
import { useIsMobile } from "@/src/hooks/useIsMobile"

interface QuickLookProduct {
  id: string
  name: string
  price: string
  materials: string[]
  swatches: { name: string; color: string }[]
  quickLookImages: string[]
  dimensions: string
}

interface QuickLookModalProps {
  product: QuickLookProduct | null
  isOpen: boolean
  onClose: () => void
}

export function QuickLookModal({ product, isOpen, onClose }: QuickLookModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSwatch, setSelectedSwatch] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
      setSelectedSwatch(0)
    }
  }, [isOpen, product?.id])

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.quickLookImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.quickLookImages.length) % product.quickLookImages.length)
  }

  const sectionTitleClass = "mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 ${isMobile ? "p-0" : "flex items-center justify-center p-4"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className={`relative z-10 w-full overflow-hidden ${
              isMobile ? "h-[100dvh]" : "max-w-6xl"
            }`}
            initial={isMobile ? { y: 28, opacity: 0 } : { scale: 0.96, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: 28, opacity: 0 } : { scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlurPanel
              className={`bg-white/95 backdrop-blur-md ${
                isMobile ? "flex h-full flex-col rounded-none" : "rounded-2xl"
              }`}
            >
              {isMobile && (
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200/80 bg-white/95 px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Quick Look</p>
                    <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
                  </div>
                  <button className="rounded-full p-2 transition-colors hover:bg-neutral-100" onClick={onClose}>
                    <X size={20} />
                  </button>
                </div>
              )}

              <div className={`${isMobile ? "flex-1 overflow-y-auto px-4 pb-4 pt-3" : "grid grid-cols-1 gap-6 p-6 lg:grid-cols-[0.92fr_1.08fr]"}`}>
                <div className="relative">
                  <div className={`relative overflow-hidden ${isMobile ? "aspect-[4/5] rounded-xl" : "mb-3 aspect-[4/5] rounded-xl"}`}>
                    <Image
                      src={product.quickLookImages[currentImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {product.quickLookImages.length > 1 && (
                      <>
                        <button
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                          onClick={prevImage}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white"
                          onClick={nextImage}
                          aria-label="Next image"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-xs text-white">
                      {currentImageIndex + 1}/{product.quickLookImages.length}
                    </div>
                  </div>

                  <div className={`mt-2 flex gap-2 ${isMobile ? "overflow-x-auto pb-1" : ""}`}>
                    {product.quickLookImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                          currentImageIndex === index ? "border-neutral-900" : "border-neutral-200"
                        } ${!isMobile ? "lg:h-14 lg:w-14" : ""}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col ${isMobile ? "mt-5 space-y-5" : "space-y-4"}`}>
                  {!isMobile && (
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="mb-1 text-2xl font-bold text-neutral-900">{product.name}</h2>
                        <p className="text-base text-neutral-600">{product.materials.join(", ")}</p>
                      </div>
                      <button className="rounded-full p-2 transition-colors hover:bg-neutral-100" onClick={onClose}>
                        <X size={24} />
                      </button>
                    </div>
                  )}

                  {isMobile && (
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">{product.name}</h2>
                      <p className="mt-1 text-sm text-neutral-600">{product.materials.join(", ")}</p>
                    </div>
                  )}

                  <div className={`${isMobile ? "text-2xl" : "text-xl"} font-bold text-neutral-900`}>{product.price}</div>

                  <div>
                    <h4 className={sectionTitleClass}>Duration</h4>
                    <p className={`${isMobile ? "text-sm" : "text-[13px]"} text-neutral-700`}>{product.dimensions}</p>
                  </div>

                  <div>
                    <h4 className={sectionTitleClass}>Style Finish</h4>
                    <div className="flex items-center gap-3">
                      {product.swatches.map((swatch, index) => (
                        <button
                          key={index}
                          className={`relative h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                            selectedSwatch === index ? "scale-110 border-neutral-900" : "border-neutral-300"
                          }`}
                          style={{ backgroundColor: swatch.color }}
                          onClick={() => setSelectedSwatch(index)}
                          aria-label={`Select ${swatch.name}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-neutral-600">Selected: {product.swatches[selectedSwatch]?.name}</p>
                  </div>

                  <div>
                    <h4 className={sectionTitleClass}>Highlights</h4>
                    <ul className={`${isMobile ? "space-y-2 text-sm" : "space-y-1.5 text-[13px]"} text-neutral-700`}>
                      <li>• Consultation and style recommendation included</li>
                      <li>• Premium products matched to your hair type</li>
                      <li>• Finishing and after-care tips from stylists</li>
                    </ul>
                  </div>

                  {!isMobile && (
                    <motion.button
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Book This Service
                    </motion.button>
                  )}
                </div>
              </div>

              {isMobile ? (
                <div className="sticky bottom-0 z-20 border-t border-neutral-200/80 bg-white/95 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                  <motion.button
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={16} />
                    Book This Service
                  </motion.button>
                </div>
              ) : null}
            </BlurPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
