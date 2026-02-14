"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal } from "./reveal"
import { useIsMobile } from "@/src/hooks/useIsMobile"
import {
  getImageByIndex,
  hairLengths,
  popularMenHairStyles,
  serviceMetaById,
  services,
} from "@/src/data/service-catalog"
import type { ChemicalService, HairLength } from "@/src/types/service-catalog"

type PreviewSample = {
  name: string
  image: string
}

function getFromPrice(service: ChemicalService) {
  const min = Math.min(
    ...service.options.flatMap((option) =>
      Object.values(option.prices).map((price) => Number.parseInt(price, 10)),
    ),
  )
  return Number.isFinite(min) ? `${min}k` : "--"
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CollectionStrip() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [selectedLength, setSelectedLength] = useState<Record<string, HairLength>>(
    () =>
      Object.fromEntries(
      services
        .filter((service): service is ChemicalService => "options" in service)
        .map((service) => [service.id, "Ngắn"]),
      ) as Record<string, HairLength>,
  )
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)
  const closeModal = () => setActiveServiceId(null)

  const activeService =
    services.find((service) => service.id === activeServiceId) ?? null
  const activeServiceIndex = activeService
    ? services.findIndex((service) => service.id === activeService.id)
    : -1
  const activeMeta = activeService
    ? serviceMetaById[activeService.id]
    : null
  const isCutMenService = activeService?.id === "cut-men"
  const activeSamples: PreviewSample[] = activeService
    ? isCutMenService
      ? popularMenHairStyles.map((styleName, styleIndex) => ({
          name: styleName,
          image: getImageByIndex(styleName, styleIndex + 60),
        }))
      : [
          { name: `${activeService.name} mẫu 1`, image: activeService.image },
          {
            name: `${activeService.name} mẫu 2`,
            image: getImageByIndex(`${activeService.name} mẫu 2`, activeServiceIndex + 20),
          },
          {
            name: `${activeService.name} mẫu 3`,
            image: getImageByIndex(`${activeService.name} mẫu 3`, activeServiceIndex + 30),
          },
        ]
    : []
  const currentPreview = activeSamples[activeSampleIndex]

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

  useEffect(() => {
    if (!activeService) return

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    window.addEventListener("keydown", onEscape)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onEscape)
      document.body.style.overflow = ""
    }
  }, [activeService])

  return (
    <section
      ref={sectionRef}
      className="relative -mt-8 overflow-hidden bg-neutral-950 py-16 text-white lg:-mt-12 lg:py-24"
    >
      <div className="mb-8 lg:mb-10">
        <Reveal>
          <div className="container-custom text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500 mb-3">
              Bảng giá tóc
            </p>
            <h2
              className={`mb-4 font-normal tracking-tight ${
                isMobile ? "text-4xl sm:text-5xl" : "text-6xl"
              }`}
            >
              Dịch vụ và giá
            </h2>
            <p
              className={`mx-auto max-w-2xl text-neutral-300 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              Tinh chỉnh mái tóc chuẩn gu, nâng tầm thần thái sau mỗi lần ghé
              salon.
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
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`flex-shrink-0 group cursor-pointer ${
                isMobile ? "w-64" : "w-80"
              }`}
              onClick={() => {
                setActiveServiceId(service.id)
                setActiveSampleIndex(0)
              }}
              whileHover={isMobile ? {} : { scale: 1.03, y: -12 }}
              transition={{
                duration: 0.4,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <motion.div
                  className="relative w-full h-full"
                  whileHover={isMobile ? {} : { scale: 1.04 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                    priority={index < 2}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/5" />
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
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-300">
                        {service.category}
                      </p>
                      <h3
                        className={`font-semibold tracking-[0.18em] mb-1 ${
                          isMobile ? "text-xs" : "text-sm"
                        }`}
                      >
                        DỊCH VỤ
                      </h3>
                      <p
                        className={`font-black tracking-tight leading-tight ${
                          isMobile ? "text-xl" : "text-2xl"
                        }`}
                      >
                        {service.name}
                      </p>
                      {"options" in service ? (
                        <div className="mt-3 ">
                          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm">
                            Từ {getFromPrice(service)}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm">
                            {service.price}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 text-neutral-500 text-xs tracking-[0.25em] uppercase">
        {isMobile
          ? "Vuốt để xem thêm dịch vụ"
          : "Cuộn để khám phá toàn bộ bảng giá"}
      </div>

      {activeService && activeMeta && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-6"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-white hover:bg-white/10"
            >
              x
            </button>

            <div className="grid gap-6 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.25fr)]">
              <div className="md:sticky md:top-4 md:self-start">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={currentPreview?.image ?? activeService.image}
                    alt={currentPreview?.name ?? `${activeService.name} - ảnh mẫu`}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {isCutMenService && currentPreview && (
                  <div className="mt-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-100">
                    Preview: {currentPreview.name}
                  </div>
                )}
                <div
                  className={`mt-3 grid gap-2 ${
                    isCutMenService
                      ? "max-h-52 grid-cols-4 overflow-y-auto pr-1"
                      : "grid-cols-3"
                  }`}
                >
                  {activeSamples.map((sample, sampleIndex) => (
                    <button
                      key={`${activeService.id}-sample-${sampleIndex}`}
                      type="button"
                      onClick={() => setActiveSampleIndex(sampleIndex)}
                      className={`relative overflow-hidden rounded-xl border transition ${
                        activeSampleIndex === sampleIndex
                          ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <div className={`${isCutMenService ? "aspect-square" : "aspect-[4/5]"}`}>
                      <Image
                        src={sample.image}
                        alt={sample.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                        unoptimized
                      />
                      </div>
                      {isCutMenService && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 py-1 text-[10px] font-medium text-white">
                          {sample.name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                    {activeService.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {activeService.name}
                  </h3>
                </div>

                {"options" in activeService ? (
                  <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
                      Chọn độ dài để xem giá
                    </p>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {hairLengths.map((length) => {
                        const active = selectedLength[activeService.id] === length
                        return (
                          <button
                            key={`${activeService.id}-modal-${length}`}
                            type="button"
                            onClick={() =>
                              setSelectedLength((prev) => ({
                                ...prev,
                                [activeService.id]: length,
                              }))
                            }
                            className={`rounded-full px-3 py-1 text-xs ${
                              active
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {length}
                          </button>
                        )
                      })}
                    </div>
                    <div className="space-y-2">
                      {activeService.options.map((option) => (
                        <div
                          key={`${activeService.id}-modal-${option.label}`}
                          className="flex items-center justify-between gap-2 rounded-lg bg-black/30 px-3 py-2 text-sm"
                        >
                          <span className="text-neutral-300">{option.label}</span>
                          <span className="font-semibold text-white">
                            {
                              option.prices[
                                selectedLength[activeService.id] ?? "Ngắn"
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black">
                      Giá: {activeService.price}
                    </span>
                  </div>
                )}

                <div className="mt-5 grid gap-3 text-sm text-neutral-200">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Tổng quan
                    </p>
                    <p>{activeMeta.overview}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Mô tả chi tiết
                    </p>
                    <p>{activeMeta.description}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3.5">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-200">
                        Ưu điểm
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-emerald-50">
                        {activeMeta.pros.map((item) => (
                          <li key={`${activeService.id}-pro-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3.5">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-rose-200">
                        Nhược điểm
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-rose-50">
                        {activeMeta.cons.map((item) => (
                          <li key={`${activeService.id}-con-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Đối tượng phù hợp
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {activeMeta.suitableFor.map((item) => (
                        <li
                          key={`${activeService.id}-fit-${item}`}
                          className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-xs"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3.5 text-emerald-100">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-200">
                      Thời gian khuyến nghị
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {activeMeta.recommendedInterval}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-4 border-t border-white/10 bg-neutral-900/90 p-3 backdrop-blur-sm md:hidden">
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-black"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
