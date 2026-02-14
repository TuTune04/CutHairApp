"use client"

import React from "react"
import { cn } from "@/src/lib/utils"

export interface SeasonCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

type SeasonCardInternalProps = SeasonCardProps & {
  isActive?: boolean
  onSelect?: () => void
}

interface SeasonalHoverCardsProps {
  cards: SeasonCardProps[]
  className?: string
  activeIndex?: number
  onSelectCard?: (index: number) => void
}

const SeasonCard = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  className,
  isActive = false,
  onSelect,
}: SeasonCardInternalProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={cn(
        "group relative flex h-[320px] w-full flex-col justify-end overflow-hidden rounded-lg bg-black p-6 shadow-lg transition-all duration-500 md:h-[350px] md:w-1/3 lg:h-[450px] hover:w-2/3",
        isActive && "ring-2 ring-white/60",
        className
      )}
    >
      <img
        src={imageSrc}
        className="absolute inset-0 w-full h-full object-cover object-center"
        alt={imageAlt || title}
      />
      <div className="relative md:absolute md:bottom-20 z-10 space-y-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-300">{subtitle}</p>
      </div>
      <div className="mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <p className="text-lg text-white">{description}</p>
      </div>
    </button>
  )
}

export function SeasonalHoverCards({
  cards,
  className,
  activeIndex = 0,
  onSelectCard,
}: SeasonalHoverCardsProps) {
  return (
    <div className={cn("flex flex-wrap md:flex-nowrap gap-4 w-full px-4", className)}>
      {cards.map((card, index) => (
        <SeasonCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          isActive={activeIndex === index}
          onSelect={() => onSelectCard?.(index)}
        />
      ))}
    </div>
  )
}