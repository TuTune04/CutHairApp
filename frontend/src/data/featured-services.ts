import type { FeaturedService } from "@/src/types/catalog"

// Add new featured services here.
export const featuredServices: FeaturedService[] = [
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
