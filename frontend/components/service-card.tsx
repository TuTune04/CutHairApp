"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
  position: "top-left" | "center" | "top-right"
}

export function ServiceCard({ product, onQuickLook, position }: ServiceCardProps) {
  const getCardStyle = () => {
    const baseStyle = {
      aspectRatio: "25/36",
      "--r": "20px",
      "--s": "40px",
    } as React.CSSProperties & { "--r": string; "--s": string }

    switch (position) {
      case "top-left":
        return {
          ...baseStyle,
          maskImage: `
            calc(var(--s) + var(--r)) 0 var(--r) radial-gradient(#0000 70%, #000 72%) no-repeat,
            0 calc(var(--s) + var(--r)) var(--r) radial-gradient(#0000 70%, #000 72%) no-repeat,
            radial-gradient(var(--s) at 100% 100%, #0000 99%, #000 101%) calc(100% - var(--r)) calc(100% - var(--r)) no-repeat,
            conic-gradient(at calc(100% - var(--s) - 2 * var(--r)) calc(100% - var(--s) - 2 * var(--r)), #000 75%, #0000 0)
          `,
          maskSize: "100% 100%",
          maskComposite: "intersect",
        }
      case "center":
        return {
          ...baseStyle,
          maskImage: `
            radial-gradient(var(--s) at 0% 0%, #0000 99%, #000 101%) var(--r) var(--r) no-repeat,
            radial-gradient(var(--s) at 100% 0%, #0000 99%, #000 101%) calc(100% - var(--r)) var(--r) no-repeat,
            radial-gradient(var(--s) at 0% 100%, #0000 99%, #000 101%) var(--r) calc(100% - var(--r)) no-repeat,
            radial-gradient(var(--s) at 100% 100%, #0000 99%, #000 101%) calc(100% - var(--r)) calc(100% - var(--r)) no-repeat
          `,
          maskSize: "100% 100%",
          maskComposite: "intersect",
        }
      case "top-right":
        return {
          ...baseStyle,
          maskImage: `
            0 0 var(--r) radial-gradient(#0000 70%, #000 72%) no-repeat,
            calc(100% - var(--s) - var(--r)) 0 var(--r) radial-gradient(#0000 70%, #000 72%) no-repeat,
            radial-gradient(var(--s) at 0% 100%, #0000 99%, #000 101%) var(--r) calc(100% - var(--r)) no-repeat,
            conic-gradient(at calc(var(--s) + 2 * var(--r)) calc(100% - var(--s) - 2 * var(--r)), #000 75%, #0000 0)
          `,
          maskSize: "100% 100%",
          maskComposite: "intersect",
        }
      default:
        return baseStyle
    }
  }

  return (
    <motion.div
      className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      style={getCardStyle()}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <motion.span
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm inline-block",
              product.badge === "Popular" && "bg-emerald-500/90 text-white",
              product.badge === "Premium" && "bg-purple-500/90 text-white",
              product.badge === "Best Seller" && "bg-rose-500/90 text-white",
              product.badge === "New" && "bg-green-500/90 text-white",
              product.badge === "Back in stock" && "bg-blue-500/90 text-white",
              product.badge === "Limited" && "bg-amber-500/90 text-white",
            )}
            whileHover={{ scale: 1.05 }}
          >
            {product.badge}
          </motion.span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-full">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Product Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">{product.name}</h3>
            <p className="text-sm text-white/85 mb-3 drop-shadow-md">{product.materials.join(" • ")}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white drop-shadow-lg">{product.price}</span>
              <motion.button
                onClick={() => onQuickLook(product)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
