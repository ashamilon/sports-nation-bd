"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface CountdownBannerData {
  id: string
  title: string
  subtitle?: string
  targetDate: string
  backgroundImage?: string
  isVisible: boolean
  sortOrder: number
}

interface CountdownBannerProps {
  targetDate?: string
  title?: string
  subtitle?: string
  backgroundImage?: string
  showTimer?: boolean
}

export default function CountdownBanner({
  targetDate,
  title,
  subtitle,
  backgroundImage,
  showTimer = true
}: CountdownBannerProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)
  const [bannerData, setBannerData] = useState<CountdownBannerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle click to redirect to Limited Time Offer collection
  const handleBannerClick = () => {
    router.push('/collections/limited-time-offer')
  }

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
  const finalBackgroundImage = backgroundImage || bannerData?.backgroundImage

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
      <div className="w-full h-64 md:h-80 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl"></div>
    )
  }

  // Don't render if no banner data and no props provided
  if (!bannerData && !title && !targetDate) {
    return null
  }

  return (
    <div 
      className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      onClick={handleBannerClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleBannerClick()
        }
      }}
      aria-label="Click to view Limited Time Offer collection"
    >
      {/* Background Image with Fade Effect */}
      <div className="absolute inset-0">
        {finalBackgroundImage ? (
          <Image
            src={finalBackgroundImage}
            alt="Countdown Banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          /* Default gradient background */
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800"></div>
        )}
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent"></div>
        {/* Mobile-specific gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/40 md:hidden"></div>
        
        {/* Click Indicator */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 w-full">
          {/* Desktop Layout - Side by Side */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Left Side - Text Content */}
            <motion.div 
              className="flex-1 max-w-md"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2 
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {finalTitle}
              </motion.h2>
              <motion.p 
                className="text-white/90 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {finalSubtitle}
              </motion.p>
            </motion.div>

            {/* Right Side - Countdown Timer */}
            {showTimer && (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
              {/* Days */}
              <div className="text-center">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">
                    Days
                  </div>
                </motion.div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xl md:text-2xl font-bold">:</div>

              {/* Hours */}
              <div className="text-center">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">
                    Hours
                  </div>
                </motion.div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xl md:text-2xl font-bold">:</div>

              {/* Minutes */}
              <div className="text-center">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">
                    Minutes
                  </div>
                </motion.div>
              </div>

              {/* Separator */}
              <div className="text-white/60 text-xl md:text-2xl font-bold">:</div>

              {/* Seconds */}
              <div className="text-center">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">
                    Seconds
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          </div>

          {/* Mobile Layout - Centered Timer with Text Below */}
          <div className="md:hidden flex flex-col items-center justify-center h-full space-y-6">
            {/* Centered Countdown Timer */}
            {showTimer && (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Days */}
                <div className="text-center">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[50px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl font-bold text-white">
                      {timeLeft.days.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/80 uppercase tracking-wide">
                      Days
                    </div>
                  </motion.div>
                </div>

                {/* Separator */}
                <div className="text-white/60 text-lg font-bold">:</div>

                {/* Hours */}
                <div className="text-center">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[50px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl font-bold text-white">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/80 uppercase tracking-wide">
                      Hours
                    </div>
                  </motion.div>
                </div>

                {/* Separator */}
                <div className="text-white/60 text-lg font-bold">:</div>

                {/* Minutes */}
                <div className="text-center">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[50px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl font-bold text-white">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/80 uppercase tracking-wide">
                      Minutes
                    </div>
                  </motion.div>
                </div>

                {/* Separator */}
                <div className="text-white/60 text-lg font-bold">:</div>

                {/* Seconds */}
                <div className="text-center">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[50px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xl font-bold text-white">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/80 uppercase tracking-wide">
                      Seconds
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Text Content Below Timer */}
            <motion.div 
              className="text-center max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {finalTitle}
              </motion.h2>
              <motion.p 
                className="text-white/90 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {finalSubtitle}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </div>
  )
}
