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
    <section className="py-20 lg:py-28 bg-black">
      <div className="container-custom space-y-10">
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
      </div>
    </section>
  )
}

