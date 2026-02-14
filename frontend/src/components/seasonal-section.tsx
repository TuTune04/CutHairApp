"use client"

import { SeasonalHoverCards } from "@/src/components/lightswind/seasonal-hover-cards"

const seasonalCards = [
  {
    title: "Season 1",
    subtitle: "Spring",
    description: "Spring is the season of new beginnings.",
    imageSrc: "/images/tocnu1.jpg",
  },
  {
    title: "Season 2",
    subtitle: "Summer",
    description: "Summer is the season of warmth.",
    imageSrc: "/images/tocnu2.jpg",
  },
  {
    title: "Season 3",
    subtitle: "Fall",
    description: "Fall is the season of harvest.",
    imageSrc: "/images/tocnu3.jpg",
  },
  {
    title: "Season 4",
    subtitle: "Winter",
    description: "Winter is the season of cold.",
    imageSrc: "/images/tocnu4.jpg",
  },
]

export function SeasonalSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-black/70 to-black" />

      <div className="container-custom relative z-10 space-y-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-4">
            Seasonal moods
          </p>
          <h2 className="font-black text-white mb-4 tracking-tighter leading-none text-4xl sm:text-5xl lg:text-6xl">
            Four seasons
            <br />
            of hair stories
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-xl">
            Explore our seasonal looks – from light, airy cuts for spring to bold winter transformations.
            Hover each panel to reveal the mood of the season.
          </p>
        </div>

        <SeasonalHoverCards cards={seasonalCards} className="mt-6" />

        <div className="pt-4">
          <p className="text-white/50 text-xs uppercase tracking-[0.28em]">
            Next chapter: materials and treatment stories
          </p>
        </div>
      </div>
    </section>
  )
}

