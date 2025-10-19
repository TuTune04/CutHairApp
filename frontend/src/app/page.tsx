"use client"
import { Header } from "@/src/components/header"
import { HeroSection } from "@/src/components/hero-section"
import { FeaturedProducts } from "@/src/components/featured-products"
import { CollectionStrip } from "@/src/components/collection-strip"
import { MaterialsSection } from "@/src/components/materials-section"
import { NewsletterSection } from "@/src/components/newsletter-section"
import { Footer } from "@/src/components/footer"
import { SeasonalHoverCards } from "@/src/components/lightswind/seasonal-hover-cards"
import SlidingCards from "@/src/components/lightswind/sliding-cards"
import Test from "../components/lightswind/test"


const cards = [
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
];



// title,
// subtitle,
// description,
// imageSrc,
// imageAlt,
// className,

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <CollectionStrip />

  <SeasonalHoverCards cards={cards} />
      {/* <Test /> */}
      <MaterialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
