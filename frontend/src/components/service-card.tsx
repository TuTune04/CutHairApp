"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/hooks/useIsMobile"

interface ServiceCardProps {
  product: {
    id: string
    name: string
    price: string
    image: string
    badge?: "New" | "Back in stock" | "Limited" | "Popular" | "Premium" | "Best Seller"
    materials: string[]
    swatches: { name: string; color: string }[]
    quickLookImages: string[]
    dimensions: string
  }
  onQuickLook: (product: any) => void
  position: "left" | "center" | "right"
}

export function ServiceCard({ product, onQuickLook, position }: ServiceCardProps) {
  const isMobile = useIsMobile()
  
  const getCardStyle = () => {
    return {
      aspectRatio: isMobile ? "4/5" : "3/4", // Taller on mobile for better content display
    } as React.CSSProperties
  }

  return (
    <motion.div
      className="group relative bg-black overflow-hidden border-2 border-white"
      style={getCardStyle()}
      whileHover={{ scale: 1.02, y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      {product.badge && (
        <div className={`absolute z-20 ${isMobile ? "top-4 left-4" : "top-6 left-6"}`}>
          <motion.div
            className={cn(
              "font-black tracking-widest border-2 inline-block bg-black",
              isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-xs",
              product.badge === "Popular" && "border-white text-white",
              product.badge === "Premium" && "border-white text-white bg-white text-black",
              product.badge === "Best Seller" && "border-white text-white",
            )}
            whileHover={{ scale: 1.1 }}
          >
            {product.badge}
          </motion.div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-full">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? "p-4" : "p-8"}`}>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Service name - bold and large */}
            <h3 className={`font-black text-white mb-3 tracking-tight leading-tight ${
              isMobile ? "text-xl" : "text-2xl lg:text-3xl"
            }`}>
              {product.name}
            </h3>

            {/* Materials - minimal and clean */}
            <p className={`text-white/60 mb-4 font-light tracking-widest uppercase ${
              isMobile ? "text-xs" : "text-xs"
            }`}>
              {product.materials.join(" • ")}
            </p>

            <div className={`bg-white mb-4 ${isMobile ? "w-8 h-1" : "w-12 h-1"}`} />

            {/* Price and CTA */}
            <div className="flex items-end justify-between">
              <span className={`font-black text-white tracking-tighter ${
                isMobile ? "text-2xl" : "text-3xl"
              }`}>{product.price}</span>
              <motion.button
                onClick={() => onQuickLook(product)}
                className={`bg-white text-black font-black tracking-widest border-2 border-white hover:bg-black hover:text-white transition-all duration-300 uppercase ${
                  isMobile ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
