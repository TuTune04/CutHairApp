"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/hooks/useIsMobile"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerTheme, setHeaderTheme] = useState<"dark" | "light">("dark")
  const isMobile = useIsMobile()

  useEffect(() => {
    const detectThemeAtHeader = () => {
      const probeX = window.innerWidth / 2
      const probeY = isMobile ? 26 : 34
      const elementAtProbe = document.elementFromPoint(probeX, probeY) as HTMLElement | null
      const themedSection = elementAtProbe?.closest("[data-header-theme]") as HTMLElement | null
      const themeAttr = themedSection?.getAttribute("data-header-theme")
      setHeaderTheme(themeAttr === "light" ? "light" : "dark")
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      detectThemeAtHeader()
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [isMobile])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md",
        headerTheme === "dark"
          ? "border-b border-white/10 bg-black/20"
          : "border-b border-neutral-900/10 bg-white/75",
        !isScrolled && headerTheme === "dark" && "border-transparent bg-transparent",
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
                headerTheme === "dark" ? "text-white hover:text-white/80" : "text-neutral-900 hover:text-neutral-700",
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
