import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "LUXE Hair Studio — Premium Hair Styling & Booking",
  description: "Book your perfect haircut, color, and styling services at LUXE Hair Studio.",
  generator: "v0.app",
  alternates: {
    canonical: "https://luxehair.example/",
  },
  openGraph: {
    siteName: "LUXE Hair Studio",
    title: "Premium Hair Styling & Booking | LUXE Hair Studio",
    description: "Book your perfect haircut, color, and styling services at LUXE Hair Studio.",
    type: "website",
    url: "https://luxehair.example/",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/opengraph-katachi.jpg-7vz2r3hxZA6woukGOmH115Fg7Piyjs.jpeg",
        alt: "LUXE Hair Studio — Premium hair styling services",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Hair Styling & Booking | LUXE Hair Studio",
    description: "Book your perfect haircut, color, and styling services at LUXE Hair Studio.",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/opengraph-katachi.jpg-7vz2r3hxZA6woukGOmH115Fg7Piyjs.jpeg",
        alt: "LUXE Hair Studio — Premium hair styling services",
      },
    ],
    site: "@luxehair",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">{children}</body>
    </html>
  )
}
