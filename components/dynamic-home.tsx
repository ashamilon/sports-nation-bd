"use client"

import { useEffect } from 'react'
import { useHomepageData } from '@/lib/hooks/use-homepage-data'
import BannerSlideshowSimple from '@/components/banner-slideshow-simple'
import BannerPreloader from '@/components/banner-preloader'
import CountdownTimer from '@/components/countdown-timer'
import HeroSection from '@/components/hero-section'
import LazyHomepageSection from '@/components/lazy-homepage-section'
import CategoriesSection from '@/components/categories-section'
import CountdownBanner from '@/components/countdown-banner'
import CollectionsSection from '@/components/collections-section'
import CollectionsDisplay from '@/components/collections-display'
import { 
  SkeletonBanner, 
  SkeletonCountdown, 
  SkeletonSection 
} from '@/components/skeleton-loading'

export default function DynamicHome() {
  const { data, loading, error, isHydrated, isSectionVisible } = useHomepageData()

  // Show loading state
  if (loading || !isHydrated) {
    return (
      <div className="space-y-8">
        <div className="container mx-auto px-4 pt-8">
          <SkeletonBanner />
        </div>
        <div className="container mx-auto px-4">
          <SkeletonSection title="Loading...">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </SkeletonSection>
        </div>
        <div className="container mx-auto px-4">
          <SkeletonSection title="Loading...">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </SkeletonSection>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Homepage</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-8">

      {/* Home Top Banners - Slideshow */}
      {isSectionVisible('banner') && data?.banners?.homeTop && data.banners.homeTop.length > 0 && data && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshowSimple 
            banners={data.banners.homeTop}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Hero Section */}
      {isSectionVisible('hero') && <HeroSection />}

      {/* Circular Collections Carousel */}
      <LazyHomepageSection component="circular-carousel" />

      {/* Home Hero Banners - Slideshow */}
      {isSectionVisible('banner') && data?.banners?.homeHero && data.banners.homeHero.length > 0 && data && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshowSimple 
            banners={data.banners.homeHero}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Countdown Timers */}
      {isSectionVisible('countdown') && data?.countdowns && data.countdowns.length > 0 && data && (
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {data.countdowns.map((countdown) => (
              <CountdownTimer
                key={countdown.id}
                {...countdown}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {isSectionVisible('categories') && <CategoriesSection />}

      {/* Countdown Banner */}
      <div className="container mx-auto px-4">
        <CountdownBanner />
      </div>

      {/* Collections Section */}
      {isSectionVisible('collections') && data?.collections && data.collections.length > 0 && (
        <CollectionsSection collections={data.collections} />
      )}

      {/* Collections Display Section */}
      <CollectionsDisplay />

      {/* Featured Products */}
      {isSectionVisible('featured-products') && <LazyHomepageSection component="featured-products" />}

      {/* Exclusive Products */}
      <LazyHomepageSection component="exclusive-products" />

      {/* Reviews Carousel */}
      <LazyHomepageSection component="reviews" />
    </div>
  )
}
