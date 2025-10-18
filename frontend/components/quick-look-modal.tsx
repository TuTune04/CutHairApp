"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BlurPanel } from "./blur-panel"
import { useIsMobile } from "@/hooks/useIsMobile"

interface QuickLookModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export function QuickLookModal({ product, isOpen, onClose }: QuickLookModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSwatch, setSelectedSwatch] = useState(0)
  const isMobile = useIsMobile()

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.quickLookImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.quickLookImages.length) % product.quickLookImages.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isMobile ? "p-2" : "p-4"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className={`relative w-full overflow-hidden ${
              isMobile ? "max-w-sm max-h-[120vh]" : "max-w-4xl max-h-[120vh]"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlurPanel className="bg-white/95 backdrop-blur-md">
              <div className={`grid gap-8 ${
                isMobile ? "grid-cols-1 p-4" : "grid-cols-1 lg:grid-cols-2 p-8"
              }`}>
                {/* Image Gallery */}
                <div className="relative">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.quickLookImages[currentImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Navigation Arrows */}
                    {/* {product.quickLookImages.length > 1 && (
                      <>
                        <button
                          className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 ${
                            isMobile ? "left-2 p-1" : "left-4 p-2"
                          }`}
                          onClick={prevImage}
                        >
                          <ChevronLeft size={isMobile ? 16 : 20} />
                        </button>
                        <button
                          className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 ${
                            isMobile ? "right-2 p-1" : "right-4 p-2"
                          }`}
                          onClick={nextImage}
                        >
                          <ChevronRight size={isMobile ? 16 : 20} />
                        </button>
                      </>
                    )} */}
                  </div>

                  {/* Image Thumbnails */}
                  <div className={`flex gap-2 ${isMobile ? "justify-center" : ""}`}>
                    {product.quickLookImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isMobile ? "w-12 h-12" : "w-16 h-16"
                        } ${
                          currentImageIndex === index ? "border-neutral-900" : "border-neutral-200"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes={isMobile ? "48px" : "64px"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className={`font-bold text-neutral-900 mb-2 ${
                        isMobile ? "text-xl" : "text-3xl"
                      }`}>{product.name}</h2>
                      <p className={`text-neutral-600 ${
                        isMobile ? "text-sm" : "text-lg"
                      }`}>{product.materials.join(", ")}</p>
                    </div>
                    <button
                      className={`hover:bg-neutral-100 rounded-full transition-colors duration-200 ${
                        isMobile ? "p-1" : "p-2"
                      }`}
                      onClick={onClose}
                    >
                      <X size={isMobile ? 20 : 24} />
                    </button>
                  </div>

                  <div className={`flex-1 ${isMobile ? "space-y-4" : "space-y-6"}`}>
                    {/* Price */}
                    <div className={`font-bold text-neutral-900 ${
                      isMobile ? "text-xl" : "text-2xl"
                    }`}>{product.price}</div>

                    {/* Dimensions */}
                    <div>
                      <h4 className={`font-medium text-neutral-900 mb-2 ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}>DIMENSIONS</h4>
                      <p className={`text-neutral-600 ${
                        isMobile ? "text-sm" : "text-base"
                      }`}>{product.dimensions}</p>
                    </div>

                    {/* Material Swatches */}
                    <div>
                      <h4 className={`font-medium text-neutral-900 mb-3 ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}>FINISH</h4>
                      <div className={`flex gap-3 ${isMobile ? "justify-center" : ""}`}>
                        {product.swatches.map((swatch: any, index: number) => (
                          <button
                            key={index}
                            className={`rounded-full border-2 transition-all duration-200 relative group ${
                              isMobile ? "w-6 h-6" : "w-8 h-8"
                            } ${
                              selectedSwatch === index ? "border-neutral-900 scale-110" : "border-neutral-300"
                            }`}
                            style={{ backgroundColor: swatch.color }}
                            onClick={() => setSelectedSwatch(index)}
                          >
                            <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}>
                              {swatch.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className={`font-medium text-neutral-900 mb-3 ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}>FEATURES</h4>
                      <ul className={`text-neutral-600 ${
                        isMobile ? "space-y-1 text-xs" : "space-y-2 text-sm"
                      }`}>
                        <li>• Sustainably sourced materials</li>
                        <li>• Hand-finished edges</li>
                        <li>• Made to order in Belgium</li>
                        <li>• Lifetime repair program</li>
                      </ul>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    className={`w-full bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center gap-2 ${
                      isMobile ? "py-3 text-sm" : "py-4 text-lg"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={isMobile ? 16 : 20} />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </BlurPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
