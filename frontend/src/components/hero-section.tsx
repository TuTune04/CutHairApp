"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { PackageCheck, Rocket, ShieldCheck } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"
import { BookingModal } from "./booking-modal"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

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
    <>
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
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight mb-6">
                <AnimatedText text="Premium hair styling" delay={0.5} />
                <br />
                <span className="italic font-light">
                  <AnimatedText text="for every occasion." delay={1.1} />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <motion.p
                className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed"
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
          <BlurPanel className="mx-6 mb-6 px-6 py-4 bg-black/24 backdrop-blur-md border-white/20">
            <div className="flex items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-green-400" />
                <span className="text-sm">Expert Stylists</span>
              </div>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Quick Booking</span>
              </button>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Premium Products</span>
              </div>
            </div>
          </BlurPanel>
        </motion.div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
