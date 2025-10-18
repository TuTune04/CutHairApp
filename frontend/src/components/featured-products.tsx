"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ServiceCard } from "./service-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/src/hooks/useIsMobile"

const featuredProducts = [
  {
    id: "1",
    name: "Classic Haircut",
    price: "$45",
    image: "/images/tocnam1.jpg",
    badge: "Popular" as const,
    materials: ["Expert Styling", "Premium Shampoo"],
    swatches: [
      { name: "Short", color: "#355E3B" },
      { name: "Medium", color: "#9CAF88" },
      { name: "Long", color: "#B87333" },
    ],
    quickLookImages: ["/images/tocnam2.jpg", "/images/tocnam3.jpg", "/images/tocnam4.jpg"],
    dimensions: "Duration: 45 minutes",
  },
  {
    id: "2",
    name: "Hair Color Treatment",
    price: "$85",
    image: "/images/tocnu1.jpg",
    badge: "Premium" as const,
    materials: ["Color Specialist", "Organic Dyes"],
    swatches: [
      { name: "Blonde", color: "#E2725B" },
      { name: "Brunette", color: "#CC5500" },
      { name: "Red", color: "#B87333" },
    ],
    quickLookImages: ["/images/tocnu2.jpg", "/images/tocnu3.jpg", "/images/tocnu4.jpg"],
    dimensions: "Duration: 90 minutes",
  },
  {
    id: "3",
    name: "Styling & Blowout",
    price: "$55",
    image: "/images/tocnu5.jpg",
    badge: "Best Seller" as const,
    materials: ["Professional Styling", "Heat Protection"],
    swatches: [
      { name: "Waves", color: "#9CAF88" },
      { name: "Straight", color: "#355E3B" },
      { name: "Curls", color: "#B87333" },
    ],
    quickLookImages: ["/images/tocnu6.jpg", "/images/tocnu7.jpg", "/images/tocnu8.jpg"],
    dimensions: "Duration: 60 minutes",
  },
]

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleQuickLook = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section className="py-24 lg:py-40 overflow-hidden bg-black" id="featured-products">
      <div className="container-custom">
        <Reveal>
          <div className="text-left mb-20">
            <h2 className={`font-black text-white mb-6 tracking-tighter leading-none ${
              isMobile ? "text-4xl sm:text-5xl" : "text-6xl lg:text-8xl"
            }`}>
              OUR
              <br />
              <span className="block text-white/80 font-black">SERVICES</span>
            </h2>
            <div className="w-16 h-1 bg-white mb-8" />
            <p className={`text-white/70 max-w-xl font-light tracking-wide ${
              isMobile ? "text-base" : "text-lg"
            }`}>
              Raw. Refined. Relentless. Premium hair services crafted with uncompromising attention to detail.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <motion.div
            className={`grid gap-6 lg:gap-8 relative ${
              isMobile 
                ? "grid-cols-1" 
                : "grid-cols-1 md:grid-cols-12"
            }`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {/* Card 1 */}
            <motion.div
              className={`relative z-30 ${
                isMobile ? "" : "md:col-span-4 md:mt-12"
              }`}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.9,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0}>
                <ServiceCard product={featuredProducts[0]} onQuickLook={handleQuickLook} position="left" />
              </Reveal>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className={`relative z-40 ${
                isMobile ? "" : "md:col-span-4"
              }`}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.9,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0.1}>
                <ServiceCard product={featuredProducts[1]} onQuickLook={handleQuickLook} position="center" />
              </Reveal>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className={`relative z-20 ${
                isMobile ? "" : "md:col-span-4 md:-mt-12"
              }`}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.9,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0.2}>
                <ServiceCard product={featuredProducts[2]} onQuickLook={handleQuickLook} position="right" />
              </Reveal>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
