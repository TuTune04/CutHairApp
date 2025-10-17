"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

const materials = [
  {
    id: "brazilian",
    name: "Brazilian Blowout",
    description: "Luxurious smoothing treatment for silky, frizz-free hair",
    image: "/placeholder.svg?height=600&width=600",
    backgroundImage: "/placeholder.svg?height=1200&width=1200",
    tint: "bg-green-50",
  },
  {
    id: "keratin",
    name: "Keratin Treatment",
    description: "Professional keratin infusion for strength and shine",
    image: "/placeholder.svg?height=600&width=600",
    backgroundImage: "/placeholder.svg?height=1200&width=1200",
    tint: "bg-gray-100",
  },
  {
    id: "olaplex",
    name: "Olaplex Bond",
    description: "Advanced molecular repair for damaged and colored hair",
    image: "/placeholder.svg?height=600&width=600",
    backgroundImage: "/placeholder.svg?height=1200&width=1200",
    tint: "bg-red-50",
  },
]

export function MaterialsSection() {
  const [activeMaterial, setActiveMaterial] = useState("brazilian")

  const activeMaterialData = materials.find((m) => m.id === activeMaterial) || materials[0]

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="materials">
      <div className="absolute inset-0 z-0">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            className="absolute inset-0"
            initial={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            animate={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Image
              src={material.backgroundImage || "/placeholder.svg"}
              alt={`${material.name} treatment`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-[120px] left-0 right-0 z-10">
        <div className="container-custom text-white">
          <Reveal>
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeMaterial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-bold mb-6 text-7xl"
                >
                  <AnimatedText text={activeMaterialData.name} delay={0.2} />
                </motion.h2>
              </AnimatePresence>
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                Every treatment begins with premium products, carefully selected for their effectiveness and hair health
                benefits. Our specialists use advanced techniques to deliver exceptional results.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-10 max-w-md hidden">
        <Reveal delay={0.3}>
          <blockquote className="pl-0 py-4">
            <p className="text-xl text-white leading-relaxed italic lg:text-base font-medium">
              "We believe in creating beautiful hair that makes you feel confident—treatments that enhance your natural
              beauty and last."
            </p>
            <footer className="mt-4 text-sm text-white/70">— LUXE Hair Studio</footer>
          </blockquote>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container-custom">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {materials.map((material) => (
                <motion.button
                  key={material.id}
                  className={cn(
                    "px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md",
                    activeMaterial === material.id
                      ? "bg-white text-neutral-900"
                      : "bg-white/20 text-white hover:bg-white/30",
                  )}
                  onClick={() => setActiveMaterial(material.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {material.name}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
