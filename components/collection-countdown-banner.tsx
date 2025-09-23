"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CollectionCountdownBannerProps {
  collectionName: string
  productCount?: number
  targetDate?: string
  title?: string
  subtitle?: string
}

export default function CollectionCountdownBanner({
  collectionName,
  productCount,
  targetDate,
  title,
  subtitle
}: CollectionCountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)
  const [bannerData, setBannerData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchBannerData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/countdown-banner')
        if (response.ok) {
          const data = await response.json()
          setBannerData(data.data)
        }
      } catch (error) {
        console.error('Error fetching countdown banner:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBannerData()
  }, [mounted])

  // Use props if provided, otherwise use fetched data
  const finalTitle = title || bannerData?.title || "Limited Time Offer"
  const finalSubtitle = subtitle || bannerData?.subtitle || "Don't miss out on our exclusive deals"
  const finalTargetDate = targetDate || bannerData?.targetDate || "2025-12-31T23:59:59"

  useEffect(() => {
    if (!mounted) return

    const calculateTimeLeft = () => {
      const difference = +new Date(finalTargetDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [finalTargetDate, mounted])

  if (!mounted || loading) {
    return (
      <div className="w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl mb-8"></div>
    )
  }

  // Don't render if no banner data and no props provided
  if (!bannerData && !title && !targetDate) {
    return null
  }

  return (
    <div className="relative w-full h-20 md:h-32 rounded-2xl overflow-hidden group mb-8">
      {/* Attractive Color Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F9546B] via-[#FC7651] to-[#FFDB60]"></div>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 flex flex-row items-center justify-between w-full">
          {/* Text - Left Side on Mobile and Desktop */}
          <motion.div
            className="flex-1 max-w-md text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-lg md:text-2xl font-black text-white tracking-wider uppercase freckle-face-regular"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '0.1em'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Offer Ends in
            </motion.h2>
          </motion.div>

          {/* Countdown Timer - Right Side on Mobile and Desktop */}
          <motion.div
            className="flex-shrink-0 bg-white/20 backdrop-blur-md rounded-xl p-1.5 md:p-4 text-center shadow-lg border border-white/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Days */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 md:p-2 min-w-[28px] md:min-w-[50px]">
                  <div className="text-xs md:text-xl font-bold text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[0.5rem] md:text-sm text-white/80 uppercase tracking-wide">
                    Days
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xs md:text-xl font-bold">:</div>

              {/* Hours */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 md:p-2 min-w-[28px] md:min-w-[50px]">
                  <div className="text-xs md:text-xl font-bold text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[0.5rem] md:text-sm text-white/80 uppercase tracking-wide">
                    Hours
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xs md:text-xl font-bold">:</div>

              {/* Minutes */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 md:p-2 min-w-[28px] md:min-w-[50px]">
                  <div className="text-xs md:text-xl font-bold text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[0.5rem] md:text-sm text-white/80 uppercase tracking-wide">
                    Minutes
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xs md:text-xl font-bold">:</div>

              {/* Seconds */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 md:p-2 min-w-[28px] md:min-w-[50px]">
                  <div className="text-xs md:text-xl font-bold text-white">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[0.5rem] md:text-sm text-white/80 uppercase tracking-wide">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  )
}
