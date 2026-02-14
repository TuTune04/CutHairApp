export type HairLength = "Ngắn" | "Lỡ" | "Dài"

export type BasicService = {
  id: string
  name: string
  category: "Dịch vụ lẻ" | "Phục hồi"
  price: string
  image: string
}

export type ChemicalOption = {
  label: string
  prices: Record<HairLength, string>
}

export type ChemicalService = {
  id: string
  name: string
  category: "Hóa chất"
  options: ChemicalOption[]
  image: string
}

export type ServiceCard = BasicService | ChemicalService

export type ServiceMeta = {
  overview: string
  description: string
  pros: string[]
  cons: string[]
  suitableFor: string[]
  recommendedInterval: string
}
