"use client"

import { useMemo, useState } from "react"
import { SeasonalHoverCards } from "@/src/components/lightswind/seasonal-hover-cards"
import { useIsMobile } from "@/src/hooks/useIsMobile"
import { cn } from "@/src/lib/utils"

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
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0)
  const activeSeason = seasonalCards[activeSeasonIndex]?.subtitle ?? "Spring"
  const isMobile = useIsMobile()
  const seasonDistance = isMobile ? "240vh" : "120vh"
  const isLightSeason = activeSeason === "Spring" || activeSeason === "Summer"

  const seasonBackgroundClass =
    activeSeason === "Spring"
      ? "from-rose-100/70 via-pink-100/40 to-emerald-100/40"
      : activeSeason === "Summer"
        ? "from-amber-100/80 via-yellow-100/45 to-orange-100/40"
        : activeSeason === "Fall"
          ? "from-amber-900/55 via-orange-900/35 to-black"
          : "from-sky-950/80 via-blue-950/70 to-black"

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: `${(index * 13) % 100}%`,
      duration: 7 + (index % 5) * 1.4,
      delay: (index % 6) * 0.6,
      size: 10 + (index % 4) * 3,
    }))
  }, [])

  const winterFlakes = useMemo(() => {
    return Array.from({ length: 42 }).map((_, index) => ({
      id: index,
      left: `${(index * 11) % 100}%`,
      duration: 6.5 + (index % 7) * 1.1,
      delay: (index % 10) * 0.35,
      size: 8 + (index % 4) * 3,
      sway: ((index % 7) - 3) * 9,
      blur: index % 3 === 0 ? 1.5 : 0,
    }))
  }, [])

  const summerParticles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, index) => ({
      id: index,
      left: `${(index * 14) % 100}%`,
      duration: 6 + (index % 6) * 0.9,
      delay: (index % 8) * 0.35,
      size: 6 + (index % 4) * 2,
      sway: ((index % 5) - 2) * 10,
      opacity: 0.35 + (index % 4) * 0.12,
    }))
  }, [])

  return (
    <section
      data-header-theme={isLightSeason ? "light" : "dark"}
      className={cn(
        "relative overflow-hidden bg-gradient-to-b py-24 transition-colors duration-500 lg:py-32",
        seasonBackgroundClass,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {activeSeason === "Spring" && (
          <>
            <div className="absolute -top-24 left-6 h-64 w-64 rounded-full bg-pink-300/35 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />
          </>
        )}

        {activeSeason === "Summer" && (
          <>
            <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-yellow-200/35 blur-3xl" />
            <div className="absolute bottom-0 right-8 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
          </>
        )}

        {activeSeason === "Fall" && (
          <>
            <div className="absolute -top-16 left-6 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-56 w-56 rounded-full bg-amber-700/30 blur-3xl" />
          </>
        )}

        {activeSeason === "Winter" && (
          <>
            <div className="absolute -top-16 left-8 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="absolute bottom-8 right-8 h-64 w-64 rounded-full bg-blue-300/15 blur-3xl" />
          </>
        )}

        {activeSeason === "Spring" &&
          particles.map((particle) => (
            <span
              key={`spring-${particle.id}`}
              className="absolute opacity-70"
              style={{
                left: particle.left,
                top: "-10%",
                fontSize: `${particle.size}px`,
                animation: `season-fall ${particle.duration}s linear ${particle.delay}s infinite`,
                ["--season-distance" as string]: seasonDistance,
              }}
            >
              🌸
            </span>
          ))}

        {activeSeason === "Fall" &&
          particles.map((particle) => (
            <span
              key={`fall-${particle.id}`}
              className="absolute opacity-80"
              style={{
                left: particle.left,
                top: "-10%",
                fontSize: `${particle.size + 2}px`,
                animation: `season-fall ${particle.duration + 1}s linear ${particle.delay}s infinite`,
                ["--season-distance" as string]: seasonDistance,
              }}
            >
              🍂
            </span>
          ))}

        {activeSeason === "Winter" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/10 via-white/5 to-transparent" />

            {winterFlakes.map((flake, index) => (
              <span
                key={`winter-flake-${flake.id}`}
                className="absolute text-white/95"
                style={{
                  left: flake.left,
                  top: "-12%",
                  fontSize: `${flake.size}px`,
                  filter: `drop-shadow(0 0 10px rgba(220,240,255,0.75)) blur(${flake.blur}px)`,
                  animation:
                    index % 4 === 0
                      ? `season-snow ${flake.duration + 1.4}s linear ${flake.delay}s infinite`
                      : `season-snow ${flake.duration}s linear ${flake.delay}s infinite`,
                  ["--season-sway" as string]: `${flake.sway}px`,
                  ["--season-distance" as string]: seasonDistance,
                }}
              >
                ❄
              </span>
            ))}

            {winterFlakes.slice(0, 24).map((flake) => (
              <span
                key={`winter-dot-${flake.id}`}
                className="absolute rounded-full bg-white/85"
                style={{
                  left: flake.left,
                  top: "-12%",
                  width: `${Math.max(2, flake.size / 4)}px`,
                  height: `${Math.max(2, flake.size / 4)}px`,
                  boxShadow: "0 0 12px rgba(225,245,255,0.85)",
                  animation: `season-snow ${flake.duration + 2}s linear ${flake.delay + 0.25}s infinite`,
                  ["--season-sway" as string]: `${flake.sway / 2}px`,
                  ["--season-distance" as string]: seasonDistance,
                }}
              />
            ))}
          </>
        )}

        {activeSeason === "Summer" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200/10 via-yellow-200/5 to-transparent" />
            <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl" />
            <div className="absolute top-20 right-16 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-yellow-100/25 to-transparent" />

            {summerParticles.map((particle) => (
              <span
                key={`summer-${particle.id}`}
                className="absolute rounded-full bg-gradient-to-b from-amber-100 to-yellow-300"
                style={{
                  left: particle.left,
                  top: "-8%",
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  boxShadow: "0 0 16px rgba(255,214,102,0.65)",
                  animation: `summer-glow ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                  ["--summer-sway" as string]: `${particle.sway}px`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b",
          isLightSeason ? "from-white/55 to-transparent" : "from-black to-transparent",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b",
          isLightSeason ? "from-transparent via-black/35 to-black/70" : "from-transparent via-black/70 to-black",
        )}
      />

      <div className="container-custom relative z-10 space-y-12">
        <div className="max-w-2xl">
          <p className={cn("mb-4 text-xs uppercase tracking-[0.35em]", isLightSeason ? "text-neutral-700/70" : "text-white/40")}>
            Seasonal moods
          </p>
          <h2
            className={cn(
              "mb-4 text-4xl font-black leading-none tracking-tighter sm:text-5xl lg:text-6xl",
              isLightSeason ? "text-neutral-900" : "text-white",
            )}
          >
            Four seasons
            <br />
            of hair stories
          </h2>
          <p className={cn("max-w-xl text-sm sm:text-base", isLightSeason ? "text-neutral-800/80" : "text-white/70")}>
            Explore our seasonal looks – from light, airy cuts for spring to bold winter transformations.
            Click or hover each panel to reveal the mood of the season.
          </p>
        </div>

        <SeasonalHoverCards
          cards={seasonalCards}
          className="mt-6"
          activeIndex={activeSeasonIndex}
          onSelectCard={setActiveSeasonIndex}
        />

        <div className="pt-4">
          <p className={cn("text-xs uppercase tracking-[0.28em]", isLightSeason ? "text-neutral-700/70" : "text-white/50")}>
            Next chapter: materials and treatment stories
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes season-fall {
          0% {
            transform: translateY(-10%) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(var(--season-distance, 120vh)) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes season-snow {
          0% {
            transform: translateY(-12%) translateX(0px) scale(0.75) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.95;
          }
          55% {
            transform: translateY(58vh) translateX(var(--season-sway, 0px)) scale(1) rotate(180deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(var(--season-distance, 118vh)) translateX(calc(var(--season-sway, 0px) * -0.75))
              scale(0.85) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes summer-glow {
          0% {
            transform: translateY(-8%) translateX(0px) scale(0.75);
            opacity: 0;
          }
          18% {
            opacity: 0.9;
          }
          55% {
            transform: translateY(50vh) translateX(var(--summer-sway, 0px)) scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) translateX(calc(var(--summer-sway, 0px) * -0.5)) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

