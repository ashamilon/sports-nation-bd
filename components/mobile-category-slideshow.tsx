"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Category {
  name: string
  slug: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  emoji: string
}

interface MobileCategorySlideshowProps {
  categories: Category[]
  title?: string
  className?: string
}

export default function MobileCategorySlideshow({ 
  categories, 
  title = "",
  className = "" 
}: MobileCategorySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Items per slide (2 for mobile)
  const itemsPerSlide = 2
  const totalSlides = Math.ceil(categories.length / itemsPerSlide)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
  }

  if (categories.length === 0) {
    return null
  }

  // Get current slide categories
  const getCurrentSlideCategories = () => {
    const startIndex = currentIndex * itemsPerSlide
    return categories.slice(startIndex, startIndex + itemsPerSlide)
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Title */}
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
      )}

      {/* Slideshow Container */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 gap-4"
          >
            {getCurrentSlideCategories().map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={category.href}>
                  <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 h-full category-card hover:shadow-lg hover:shadow-[#27355C]/20" style={{ backgroundColor: '#F8F9FB', border: '1px solid rgba(39, 53, 92, 0.1)' }}>
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="relative p-4 h-full flex flex-col">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                        <span style={{ color: '#27355C' }}>
                          {React.createElement(category.icon, { 
                            className: "h-6 w-6 dark:text-white category-icon"
                          })}
                        </span>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 mb-2 category-title" style={{ color: '#27355C' }}>
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 category-description" style={{ color: '#27355C' }}>
                          {category.description}
                        </p>
                      </div>
                      
                      <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                        {category.emoji}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots - Only show if more than 1 slide */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/50 hover:bg-muted-foreground/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {totalSlides > 1 && (
        <div className="mt-2 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            key={currentIndex} // Reset animation when slide changes
          />
        </div>
      )}
    </div>
  )
}
