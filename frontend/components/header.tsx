"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/useIsMobile"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOverDarkSection, setIsOverDarkSection] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Check if we're over featured-products section (has bg-black)
      const featuredSection = document.getElementById('featured-products')
      if (featuredSection) {
        const rect = featuredSection.getBoundingClientRect()
        // Check if we're currently over the dark section
        setIsOverDarkSection(rect.top <= 0 && rect.bottom >= 0)
      } else {
        setIsOverDarkSection(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b border-white/[0.02]",
        isScrolled ? "bg-white/[0.02]" : "bg-white/[0.02]",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-center h-12 lg:h-16 relative">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <a
              href="/"
              className={cn(
                "font-bold tracking-tight transition-colors",
                isMobile ? "text-lg" : "text-xl lg:text-2xl",
                // Logic mới: scroll < 20px = trắng, scroll >= 20px = đen, over dark section = trắng
                !isScrolled || isOverDarkSection ? "text-white hover:text-white/80" : "text-neutral-900 hover:text-neutral-700",
              )}
              aria-label="LUXE Hair Studio Home"
            >
              {isMobile ? "THIEN HAI" : "THIEN HAI HAIR"}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
