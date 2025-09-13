"use client"

import { useBanners, useCountdowns } from '@/lib/hooks/use-cms'
import Banner from '@/components/banner'
import CountdownTimer from '@/components/countdown-timer'
import HeroSection from '@/components/hero-section'
import CategoriesSection from '@/components/categories-section'
import FeaturedProducts from '@/components/featured-products'

export default function DynamicHome() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products - Always render */}
      <FeaturedProducts />
    </div>
  )
}
