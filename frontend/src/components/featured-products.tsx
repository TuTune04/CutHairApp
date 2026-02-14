"use client"

import { type RefObject, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ServiceCard } from "./service-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/src/hooks/useIsMobile"
import { featuredServices } from "@/src/data/featured-services"
import type { FeaturedService } from "@/src/types/catalog"
import { headingCopyByCard, type CardFocus, type HeadingSideCopy } from "@/src/data/featured-heading-copy"

const featuredProducts = featuredServices

function HeadingPanel({
  headingRef,
  align,
  copy,
  isVisible = true,
}: {
  headingRef: RefObject<HTMLDivElement | null>
  align: "left" | "right"
  copy: HeadingSideCopy
  isVisible?: boolean
}) {
  const isRight = align === "right"

  return (
    <div
      ref={headingRef as RefObject<HTMLDivElement>}
      className={`absolute top-0 w-[min(22rem,24vw)] ${isRight ? "right-0 text-right" : "left-0 text-left"}`}
      style={{ willChange: "transform, opacity", visibility: isVisible ? "visible" : "hidden" }}
    >
      <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/40">{copy.label}</p>
      <h2 className="mb-6 text-5xl font-black leading-none tracking-tighter text-white lg:text-7xl">
        OUR
        <br />
        <span className="block font-black text-white/80">SERVICES</span>
      </h2>
      <div className={`mb-8 h-[2px] w-16 bg-white ${isRight ? "ml-auto" : ""}`} />
      <p
        className={`text-sm font-light leading-relaxed tracking-wide text-white/70 lg:text-base ${isRight ? "ml-auto" : ""}`}
        style={{ whiteSpace: "pre-line" }}
      >
        {copy.descriptionLines.join("\n")}
      </p>
    </div>
  )
}

function MobileFeaturedProducts({
  onQuickLook,
}: {
  onQuickLook: (product: FeaturedService) => void
}) {
  const copyForProduct: Record<string, HeadingSideCopy> = {
    "1": headingCopyByCard[1].right,
    "2": headingCopyByCard[2].left,
    "3": headingCopyByCard[3].left,
  }

  return (
    <section className="relative bg-black px-4 py-16">
      <div className="mx-auto max-w-md space-y-10">
        <Reveal>
          <div className="space-y-4 text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Signature experiences</p>
            <h2 className="text-4xl font-black leading-none tracking-tighter text-white">
              OUR
              <br />
              <span className="block text-white/80">SERVICES</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Kham pha cac dich vu toc cao cap voi quy trinh cham soc phu hop tung nhu cau va phong cach.
            </p>
          </div>
        </Reveal>

        <div className="space-y-8">
          {featuredProducts.map((product) => {
            const copy = copyForProduct[product.id]

            return (
              <div key={product.id} className="space-y-4">
                <ServiceCard product={product} onQuickLook={onQuickLook} position="center" />
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">{copy.label}</p>
                  <p className="text-sm leading-relaxed text-white/75" style={{ whiteSpace: "pre-line" }}>
                    {copy.descriptionLines.join("\n")}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<FeaturedService | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<CardFocus>(3)
  const activeCardRef = useRef<CardFocus>(3)
  const isMobile = useIsMobile()

  const sectionRef = useRef<HTMLElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const headingLeftRef = useRef<HTMLDivElement | null>(null)
  const headingRightRef = useRef<HTMLDivElement | null>(null)

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
      const headingLeft = headingLeftRef.current
      const headingRight = headingRightRef.current

      if (!section || cards.length < 3 || !headingLeft || !headingRight) return

      const [card1, card2, card3] = cards
      const syncActiveCard = () => {
        const opacity1 = Number(gsap.getProperty(card1, "opacity")) || 0
        const opacity2 = Number(gsap.getProperty(card2, "opacity")) || 0
        const opacity3 = Number(gsap.getProperty(card3, "opacity")) || 0

        let nextCard: CardFocus = 1
        if (opacity2 >= opacity1 && opacity2 >= opacity3) nextCard = 2
        if (opacity3 >= opacity1 && opacity3 >= opacity2) nextCard = 3

        if (activeCardRef.current !== nextCard) {
          activeCardRef.current = nextCard
          setActiveCard(nextCard)
        }
      }

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

      // Initial heading state:
      // Card 3 focus => show left only
      gsap.set(headingLeft, { autoAlpha: 1, x: 0 })
      gsap.set(headingRight, { autoAlpha: 0, x: 60 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          scrub: true,
          onUpdate: syncActiveCard,
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
        .to(headingLeft, { autoAlpha: 1, x: 0, ease: "none" }, "<")
        .to(headingRight, { autoAlpha: 0, x: 60, ease: "none" }, "<")
        .to(card3, { y: "-50vh", scale: 0.95, ease: "none", duration: 1.5 })
        .to(headingLeft, { autoAlpha: 1, x: 0, duration: 1.5 }, "<")
        .to(headingRight, { autoAlpha: 0, x: 60, duration: 1.5 }, "<")
      
      // ===== PHASE 3 — Focus Card 2 (heading ở giữa/2 bên) =====
        .to(card3, { y: "-80vh", opacity: 0, ease: "none", duration: 1 })
        .to(card2, { y: "-50vh", scale: 0.95, opacity: 1, ease: "none", duration: 1.5 }, "<")
        .to(headingLeft, { autoAlpha: 1, x: 0, ease: "none", duration: 1.5 }, "<")
        .to(headingRight, { autoAlpha: 1, x: 0, ease: "none", duration: 1.5 }, "<")
        // Giữ card2 thêm một đoạn
        .to(card2, { y: "-50vh", duration: 2 })
        .to(headingLeft, { autoAlpha: 1, x: 0, duration: 2 }, "<")
        .to(headingRight, { autoAlpha: 1, x: 0, duration: 2 }, "<")
      
      // ===== PHASE 4 — Focus Card 1 (heading ở bên phải) =====
      .to(card2, { y: "-80vh", opacity: 0, ease: "none", duration: 1 })
      .to(card1, { y: "-50vh", scale: 0.95, opacity: 1, ease: "none", duration: 2.5 }, "<")
      .to(headingLeft, { autoAlpha: 0, x: -60, ease: "none", duration: 2.5 }, "<")
      .to(headingRight, { autoAlpha: 1, x: 0, ease: "none", duration: 2.5 }, "<")
      .to(card1, { y: "-50vh", duration: 1.5 })
      .to(headingLeft, { autoAlpha: 0, x: -60, duration: 1.5 }, "<")
      .to(headingRight, { autoAlpha: 1, x: 0, duration: 1.5 }, "<")

      // Sync once after setup to avoid initial mismatch.
      syncActiveCard()
      
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <div id="featured-products">
      <div className="md:hidden">
        <MobileFeaturedProducts onQuickLook={handleQuickLook} />
      </div>

      <section
        ref={sectionRef}
        className="relative hidden h-[680vh] bg-black md:block lg:h-[760vh] xl:h-[800vh]"
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
              <div className="relative z-20 w-full pt-[14vh] lg:pt-[18vh]">
                <Reveal>
                  <div className="relative h-[280px] lg:h-[360px]">
                    <HeadingPanel
                      headingRef={headingLeftRef}
                      align="left"
                      copy={headingCopyByCard[activeCard].left}
                      isVisible={activeCard !== 1}
                    />
                    <HeadingPanel
                      headingRef={headingRightRef}
                      align="right"
                      copy={headingCopyByCard[activeCard].right}
                      isVisible={activeCard !== 3}
                    />
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
                        className="absolute w-full max-w-[20rem] lg:max-w-sm xl:max-w-md"
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-48 bg-gradient-to-b from-transparent via-black/70 to-zinc-950" />
      </section>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
