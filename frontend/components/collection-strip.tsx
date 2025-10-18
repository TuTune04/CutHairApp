"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/hooks/useIsMobile"

const collections = [
  {
    id: "haircuts",
    name: "HAIRCUTS",
    image: "/images/anh1.png",
    count: "8 styles",
  },
  {
    id: "coloring",
    name: "COLORING",
    image: "/images/anh1.png",
    count: "6 options",
  },
  {
    id: "treatments",
    name: "TREATMENTS",
    image: "/images/anh1.png",
    count: "4 types",
  },
  {
    id: "styling",
    name: "STYLING",
    image: "/images/anh1.png",
    count: "5 styles",
  },
  {
    id: "extensions",
    name: "EXTENSIONS",
    image: "/images/anh1.png",
    count: "7 types",
  },
  {
    id: "bridal",
    name: "BRIDAL",
    image: "/images/anh1.png",
    count: "3 packages",
  },
  {
    id: "mens",
    name: "MEN'S CUTS",
    image: "/images/anh1.png",
    count: "4 styles",
  },
  {
    id: "kids",
    name: "KIDS",
    image: "/images/anh1.png",
    count: "6 styles",
  },
  {
    id: "perms",
    name: "PERMS",
    image: "/images/anh1.png",
    count: "5 types",
  },
  {
    id: "smoothing",
    name: "SMOOTHING",
    image: "/images/anh1.png",
    count: "8 options",
  },
]

export function CollectionStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -100])

  const itemWidth = isMobile ? 280 : 320 // Smaller width for mobile
  const totalWidth = collections.length * (itemWidth + 32) - 32 // subtract last gap
  const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const maxDrag = Math.max(0, totalWidth - containerWidth + 48) // add padding

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="mb-12">
        <Reveal>
          <div className="container-custom text-center">
            <h2 className={`text-neutral-900 mb-4 font-normal ${
              isMobile ? "text-4xl sm:text-5xl" : "text-6xl"
            }`}>Service Categories</h2>
            <p className={`text-neutral-600 max-w-2xl mx-auto ${
              isMobile ? "text-base" : "text-lg"
            }`}>
              Explore our comprehensive range of hair services, each tailored to meet your unique needs and style.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-8 px-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.1}
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className={`flex-shrink-0 group cursor-pointer ${
                isMobile ? "w-70" : "w-80"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ filter: "blur(1px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center text-white"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className={`font-bold tracking-wider mb-2 ${
                      isMobile ? "text-2xl" : "text-3xl"
                    }`}>{collection.name}</h3>
                    <p className={`opacity-90 ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}>{collection.count}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-neutral-500">← Drag to explore services →</p>
      </div>
    </section>
  )
}
