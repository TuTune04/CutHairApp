export type ServiceBadge = "New" | "Back in stock" | "Limited" | "Popular" | "Premium" | "Best Seller"

export type ServiceSwatch = {
  name: string
  color: string
}

export type FeaturedService = {
  id: string
  name: string
  price: string
  image: string
  badge: ServiceBadge
  materials: string[]
  swatches: ServiceSwatch[]
  quickLookImages: string[]
  dimensions: string
}

export type HairStyleOption = {
  id: string
  name: string
  image: string
  description: string
  faceShapes: string[]
  estimatedTime: number
}

export type HairGender = "male" | "female"
