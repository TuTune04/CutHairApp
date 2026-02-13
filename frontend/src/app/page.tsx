"use client"
import { Header } from "@/src/components/header"
import { HeroSection } from "@/src/components/hero-section"
import { FeaturedProducts } from "@/src/components/featured-products"
import { CollectionStrip } from "@/src/components/collection-strip"
import { SeasonalSection } from "@/src/components/seasonal-section"
import { MaterialsSection } from "@/src/components/materials-section"
import { NewsletterSection } from "@/src/components/newsletter-section"
import { Footer } from "@/src/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <CollectionStrip />
      <SeasonalSection />
      <MaterialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
