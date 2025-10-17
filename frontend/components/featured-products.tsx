"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ServiceCard } from "./service-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"

const featuredProducts = [
  {
    id: "1",
    name: "Classic Haircut",
    price: "$45",
    image: "/professional-haircut-styling.jpg",
    badge: "Popular" as const,
    materials: ["Expert Styling", "Premium Shampoo"],
    swatches: [
      { name: "Short", color: "#355E3B" },
      { name: "Medium", color: "#9CAF88" },
      { name: "Long", color: "#B87333" },
    ],
    quickLookImages: ["/professional-haircut-styling.jpg", "/haircut-side-view.jpg", "/haircut-back-view.jpg"],
    dimensions: "Duration: 45 minutes",
  },
  {
    id: "2",
    name: "Hair Color Treatment",
    price: "$85",
    image: "/hair-coloring-service.jpg",
    badge: "Premium" as const,
    materials: ["Color Specialist", "Organic Dyes"],
    swatches: [
      { name: "Blonde", color: "#E2725B" },
      { name: "Brunette", color: "#CC5500" },
      { name: "Red", color: "#B87333" },
    ],
    quickLookImages: ["/hair-coloring-service.jpg", "/hair-color-detail.jpg", "/hair-color-result.jpg"],
    dimensions: "Duration: 90 minutes",
  },
  {
    id: "3",
    name: "Styling & Blowout",
    price: "$55",
    image: "/professional-hair-styling.jpg",
    badge: "Best Seller" as const,
    materials: ["Professional Styling", "Heat Protection"],
    swatches: [
      { name: "Waves", color: "#9CAF88" },
      { name: "Straight", color: "#355E3B" },
      { name: "Curls", color: "#B87333" },
    ],
    quickLookImages: ["/professional-hair-styling.jpg", "/hair-styling-waves.jpg", "/hair-styling-curls.jpg"],
    dimensions: "Duration: 60 minutes",
  },
]

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQuickLook = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section className="py-20 lg:py-32 overflow-hidden" id="featured-products">
      <div className="container-custom">
        <Reveal>
          <div className="text-left mb-16">
            <h2 className="text-4xl text-neutral-900 mb-4 lg:text-6xl">
              Our <span className="italic font-light">Services</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Discover our most popular hair services, each delivered with meticulous attention to detail and
              personalized care.
            </p>
          </div>
        </Reveal>

        <div className="relative h-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-0 relative"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {/* Card 1 - Top Left */}
            <motion.div
              className="md:col-span-1 relative z-30"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0}>
                <ServiceCard product={featuredProducts[0]} onQuickLook={handleQuickLook} position="top-left" />
              </Reveal>
            </motion.div>

            {/* Card 2 - Center (overlapping) */}
            <motion.div
              className="md:col-span-1 relative z-40 md:-mt-12"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0.1}>
                <ServiceCard product={featuredProducts[1]} onQuickLook={handleQuickLook} position="center" />
              </Reveal>
            </motion.div>

            {/* Card 3 - Top Right */}
            <motion.div
              className="md:col-span-1 relative z-20"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={0.2}>
                <ServiceCard product={featuredProducts[2]} onQuickLook={handleQuickLook} position="top-right" />
              </Reveal>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
