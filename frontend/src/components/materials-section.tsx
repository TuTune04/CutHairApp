"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/hooks/useIsMobile"
import { Play, Instagram } from "lucide-react"

const materials = [
  {
    id: "brazilian",
    name: "Doris Phạm",
    description: "Luxurious smoothing treatment for silky, frizz-free hair",
    image: "/images/tocnu10.png",
    backgroundImage: "/images/tocnu10.png",
    video: "/videos/review.mp4",
    tint: "bg-green-50",
  },
  {
    id: "keratin",
    name: "Keratin Treatment",
    description: "Professional keratin infusion for strength and shine",
    image: "/images/tocnu9.png",
    backgroundImage: "/images/tocnu9.png",
    video: "/videos/review2.mp4",
    tint: "bg-gray-100",
  },
  {
    id: "olaplex",
    name: "Olaplex Bond",
    description: "Advanced molecular repair for damaged and colored hair",
    image: "/images/anh1.png",
    backgroundImage: "/images/anh1.png",
    video: "/videos/review.mp4",
    tint: "bg-red-50",
  },
]

export function MaterialsSection() {
  const [activeMaterial, setActiveMaterial] = useState("brazilian")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoInView, setIsVideoInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const activeMaterialData = materials.find((m) => m.id === activeMaterial) || materials[0]

  // IntersectionObserver để lazy load video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoInView(true)
            // Auto play khi video vào viewport
            if (videoRef.current) {
              videoRef.current.play().catch(console.error)
              setIsVideoPlaying(true)
            }
          } else {
            // Pause khi video ra khỏi viewport
            if (videoRef.current) {
              videoRef.current.pause()
              setIsVideoPlaying(false)
            }
          }
        })
      },
      {
        threshold: 0.5, // Play khi 50% video hiển thị
        rootMargin: '0px 0px -10% 0px' // Pause sớm hơn khi scroll ra
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Handle video click để toggle play/pause
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play().catch(console.error)
        setIsVideoPlaying(true)
      }
    }
  }

  // Update video source khi activeMaterial thay đổi
  useEffect(() => {
    if (videoRef.current && activeMaterialData.video) {
      const currentTime = videoRef.current.currentTime
      const wasPlaying = !videoRef.current.paused
      
      // Pause video hiện tại
      videoRef.current.pause()
      
      // Update video source
      videoRef.current.src = activeMaterialData.video
      videoRef.current.load()
      
      // Resume play nếu đang playing và video trong view
      if (wasPlaying && isVideoInView) {
        videoRef.current.currentTime = 0 // Reset về đầu video mới
        videoRef.current.play().catch(console.error)
        setIsVideoPlaying(true)
      } else {
        setIsVideoPlaying(false)
      }
    }
  }, [activeMaterial, activeMaterialData.video, isVideoInView])

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
      <span>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.03,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="materials">
      <div className="absolute inset-0 z-0">
        {materials.map((material) => (
          <motion.div
            key={material.id}
            className="absolute inset-0"
            initial={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            animate={{ opacity: material.id === activeMaterial ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Image
              src={material.backgroundImage || "/placeholder.svg"}
              alt={`${material.name} treatment`}
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-[120px] left-0 right-0 z-10">
        <div className="container-custom text-white">
          <Reveal>
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeMaterial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`font-bold mb-6 ${
                    isMobile ? "text-4xl sm:text-5xl" : "text-7xl"
                  }`}
                >
                  <AnimatedText text={activeMaterialData.name} delay={0.2} />
                </motion.h2>
              </AnimatePresence>
              <p className={`text-white/90 leading-relaxed max-w-2xl ${
                isMobile ? "text-base" : "text-lg"
              }`}>
                Every treatment begins with premium products, carefully selected for their effectiveness and hair health
                benefits. Our specialists use advanced techniques to deliver exceptional results.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Featured Reel Video Section */}
      <div 
        ref={containerRef}
        className={`absolute z-20 ${
          isMobile ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : "top-1/2 right-8 transform -translate-y-1/2"
        }`}
      >
        <Reveal delay={0.4}>
          <motion.div
            className={`relative group cursor-pointer ${
              isMobile ? "w-64 h-80" : "w-80 h-96"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/30">
              {/* HTML5 Video với lazy load và autoplay */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/anh1.png" // Thumbnail trước khi video load
                onClick={handleVideoClick}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src={activeMaterialData.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play/Pause Overlay - chỉ hiện khi hover hoặc không playing */}
              {/* <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isVideoPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}>
                <motion.div
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isVideoPlaying ? (
                    <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                      <div className="w-1 h-6 bg-white"></div>
                      <div className="w-1 h-6 bg-white ml-1"></div>
                    </div>
                  ) : (
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  )}
                </motion.div>
              </div> */}

              {/* Instagram Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-white">
                  <h3 className={`font-bold mb-1 ${
                    isMobile ? "text-sm" : "text-base"
                  }`}>
                    {activeMaterialData.name}
                  </h3>
                  <p className={`text-white/80 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}>
                    {isVideoInView ? 'Thien Hai Hair Salon' : 'Tap to play'}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-black text-xs font-bold">✨</span>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-8 z-10 max-w-md hidden">
        <Reveal delay={0.3}>
          <blockquote className="pl-0 py-4">
            <p className="text-xl text-white leading-relaxed italic lg:text-base font-medium">
              "We believe in creating beautiful hair that makes you feel confident—treatments that enhance your natural
              beauty and last."
            </p>
            <footer className="mt-4 text-sm text-white/70">— LUXE Hair Studio</footer>
          </blockquote>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container-custom">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {materials.map((material) => (
                <motion.button
                  key={material.id}
                  className={cn(
                    "rounded-full font-medium transition-all duration-300 backdrop-blur-md",
                    isMobile ? "px-4 py-2 text-sm" : "px-6 py-3",
                    activeMaterial === material.id
                      ? "bg-white text-neutral-900"
                      : "bg-white/20 text-white hover:bg-white/30",
                  )}
                  onClick={() => setActiveMaterial(material.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {material.name}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
