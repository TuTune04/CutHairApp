"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ServiceCard } from "./service-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/src/hooks/useIsMobile"

type FeaturedService = {
  id: string
  name: string
  price: string
  image: string
  badge: "New" | "Back in stock" | "Limited" | "Popular" | "Premium" | "Best Seller"
  materials: string[]
  swatches: { name: string; color: string }[]
  quickLookImages: string[]
  dimensions: string
}

const featuredProducts: FeaturedService[] = [
  {
    id: "1",
    name: "Classic Haircut",
    price: "$45",
    image: "/images/tocnam1.jpg",
    badge: "Popular",
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
    badge: "Premium",
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
    badge: "Best Seller",
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<FeaturedService | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const sectionRef = useRef<HTMLElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const headingRef = useRef<HTMLDivElement | null>(null)

  const handleQuickLook = (product: FeaturedService) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  useEffect(() => {
    if (!sectionRef.current || isMobile) return

    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const cards = cardsRef.current
      const heading = headingRef.current

      if (!section || cards.length < 3 || !heading) return

      const [card1, card2, card3] = cards

      gsap.set([card1, card2, card3], {
        xPercent: -50,
        yPercent: -50,
      })

      gsap.set([card1, card2, card3], {
        scale: 0.8,
        opacity: 1,
      })

      // Card 1 thấp nhất → Card 3 cao nhất
      gsap.set(card1, { y: 40 })
      gsap.set(card2, { y: 0 })
      gsap.set(card3, { y: -40 })

      // Function to get current dimensions
      const getDimensions = () => {
        const container = heading.parentElement
        const containerWidth = container?.offsetWidth || window.innerWidth
        const headingWidth = heading.offsetWidth || 768 // fallback to max-w-3xl (48rem = 768px)
        return { containerWidth, headingWidth }
      }
      
      // Set initial heading position (left for card 3) and text alignment
      gsap.set(heading, { x: 0 })
      gsap.set(heading, { textAlign: "left" })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          scrub: true,
        },
      })
      
      // ===== PHASE 1 — Expand tầng =====
      tl.to(card3, { y: "-15vh", ease: "none" })
        .to(card2, { y: "20vh", ease: "none" }, "<")
        .to(card1, { y: "40vh", ease: "none" }, "<")
      
      // ===== PHASE 2 — Focus Card 3 (heading ở bên trái) =====
        .to(card3, { y: "-50vh", scale: 0.95, ease: "none" })
        .to(card2, { y: "80vh", opacity: 0.2, ease: "none" }, "<")
        .to(card1, { y: "110vh", opacity: 0, ease: "none" }, "<")
        .to(heading, { x: 0, ease: "none" }, "<") // Giữ heading ở bên trái
        .call(() => {
          heading.style.textAlign = "left"
        }, [], "<")
        .to(card3, { y: "-50vh", scale: 0.95, ease: "none", duration: 1.5 })
        .to(heading, { x: 0, duration: 1.5 }, "<") // Giữ heading ở bên trái
      
      // ===== PHASE 3 — Focus Card 2 (heading ở giữa/2 bên) =====
        .to(card3, { y: "-80vh", opacity: 0, ease: "none", duration: 1 })
        .to(card2, { y: "-50vh", scale: 0.95, opacity: 1, ease: "none", duration: 1.5 }, "<")
        .to(heading, { 
          x: () => {
            const { containerWidth, headingWidth } = getDimensions()
            return (containerWidth - headingWidth) / 2
          }, 
          ease: "none", 
          duration: 1.5 
        }, "<") // Di chuyển heading ra giữa
        .call(() => {
          heading.style.textAlign = "center"
        }, [], "<")
        // Giữ card2 thêm một đoạn
        .to(card2, { y: "-50vh", duration: 2 })
        .to(heading, { 
          x: () => {
            const { containerWidth, headingWidth } = getDimensions()
            return (containerWidth - headingWidth) / 2
          }, 
          duration: 2 
        }, "<") // Giữ heading ở giữa
      
      // ===== PHASE 4 — Focus Card 1 (heading ở bên phải) =====
      .to(card2, { y: "-80vh", opacity: 0, ease: "none", duration: 1 })
      .to(card1, { y: "-50vh", scale: 0.95, opacity: 1, ease: "none", duration: 2.5 }, "<")
      .to(heading, { 
        x: () => {
          const { containerWidth, headingWidth } = getDimensions()
          return containerWidth - headingWidth
        }, 
        ease: "none", 
        duration: 2.5 
      }, "<") // Di chuyển heading sang bên phải
      .call(() => {
        heading.style.textAlign = "right"
      }, [], "<")
      .to(card1, { y: "-50vh", duration: 1.5 })
      .to(heading, { 
        x: () => {
          const { containerWidth, headingWidth } = getDimensions()
          return containerWidth - headingWidth
        }, 
        duration: 1.5 
      }, "<") // Giữ heading ở bên phải
      
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[800vh] bg-black"
      id="featured-products"
    >
      <div className="sticky top-0 h-screen overflow-visible">
        <div className="relative h-full w-full overflow-visible">

          {/* Background */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
          </div>

          <div className="container-custom relative z-10 h-full">

            {/* HEADING LAYER */}
            <div className="relative z-20 pt-[18vh] w-full">
              <Reveal>
                <div ref={headingRef} className="max-w-3xl" style={{ willChange: 'transform', textAlign: 'left' }}>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-4">
                    Signature experiences
                  </p>
                  <h2 className="font-black text-white mb-6 tracking-tighter leading-none text-6xl lg:text-8xl">
                    OUR
                    <br />
                    <span className="block text-white/80 font-black">SERVICES</span>
                  </h2>
                  <div className="w-16 h-[2px] bg-white mb-8" />
                  <p className="text-white/70 max-w-xl font-light tracking-wide text-lg">
                    Raw. Refined. Relentless. Premium hair services crafted with uncompromising attention to detail.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* CARD STAGE LAYER */}
            <div className="absolute inset-0 z-10">
              <div className="relative h-full w-full">
                {featuredProducts.map((product, index) => {
                  const zIndex = index === 1 ? 30 : index === 0 ? 20 : 10
                  const left = index === 0 ? "20%" : index === 1 ? "50%" : "80%"

                  return (
                    <div
                      key={product.id}
                      ref={(el) => {
                        if (el) cardsRef.current[index] = el
                      }}
                      className="absolute w-full max-w-md"
                      style={{
                        left,
                        top: "100vh",
                        zIndex,
                      }}
                    >
                      <ServiceCard
                        product={product}
                        onQuickLook={handleQuickLook}
                        position={index === 0 ? "left" : index === 1 ? "center" : "right"}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
