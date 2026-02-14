"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/src/hooks/useIsMobile"

const serviceCategories = [
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CollectionStrip() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return
    if (!sectionRef.current || !trackRef.current) return

    const section = sectionRef.current
    const track = trackRef.current

    const ctx = gsap.context(() => {
      const getMaxX = () => {
        const max =
          track.scrollWidth && section.offsetWidth
            ? track.scrollWidth - section.offsetWidth
            : 0
        return -Math.max(0, max)
      }

      gsap.to(track, {
        x: getMaxX,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - section.offsetWidth || 0),
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className="relative -mt-8 overflow-hidden bg-neutral-950 py-16 text-white lg:-mt-12 lg:py-24"
    >
      <div className="mb-8 lg:mb-10">
        <Reveal>
          <div className="container-custom text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500 mb-3">
              Our services
            </p>
            <h2
              className={`mb-4 font-normal tracking-tight ${
                isMobile ? "text-4xl sm:text-5xl" : "text-6xl"
              }`}
            >
              Service Categories
            </h2>
            <p
              className={`text-neutral-400 max-w-2xl mx-auto ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              From precision cuts to advanced treatments, discover a curated
              selection of services crafted to elevate every look and texture.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Desktop: horizontal scrollytelling with GSAP; Mobile: natural drag/scroll */}
      <div
        className={`relative ${
          isMobile ? "overflow-x-auto pb-6" : "overflow-visible"
        }`}
      >
        <div
          ref={trackRef}
          className="flex gap-8 px-6 will-change-transform"
          style={{
            width: isMobile ? "max-content" : "auto",
          }}
        >
          {serviceCategories.map((category) => (
            <motion.div
              key={category.id}
              className={`flex-shrink-0 group cursor-pointer ${
                isMobile ? "w-64" : "w-80"
              }`}
              whileHover={isMobile ? {} : { scale: 1.03, y: -12 }}
              transition={{
                duration: 0.4,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 border border-white/10 bg-neutral-900">
                <motion.div
                  className="relative w-full h-full"
                  whileHover={isMobile ? {} : { scale: 1.04 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                    priority={category.id === "haircuts"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </motion.div>

                <div className="absolute inset-0 flex items-end">
                  <div className="p-5 sm:p-6">
                    <motion.div
                      className="text-left"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-2">
                        {category.count}
                      </p>
                      <h3
                        className={`font-semibold tracking-[0.18em] mb-1 ${
                          isMobile ? "text-xs" : "text-sm"
                        }`}
                      >
                        CATEGORY
                      </h3>
                      <p
                        className={`font-black tracking-tight leading-tight ${
                          isMobile ? "text-2xl" : "text-3xl"
                        }`}
                      >
                        {category.name}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 text-neutral-500 text-xs tracking-[0.25em] uppercase">
        {isMobile ? "Swipe to explore services" : "Scroll to journey through our services"}
      </div>
    </section>
  )
}
