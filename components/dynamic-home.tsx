"use client"

import { useHomepageData } from '@/lib/hooks/use-homepage-data'
import BannerSlideshow from '@/components/banner-slideshow'
import CountdownTimer from '@/components/countdown-timer'
import HeroSection from '@/components/hero-section'
import CircularCollectionsCarousel from '@/components/circular-collections-carousel'
import CategoriesSection from '@/components/categories-section'
import CollectionsSection from '@/components/collections-section'
import FeaturedProducts from '@/components/featured-products'
import ReviewsCarousel from '@/components/reviews-carousel'
import { 
  SkeletonBanner, 
  SkeletonCountdown, 
  SkeletonSection 
} from '@/components/skeleton-loading'

export default function DynamicHome() {
  const { data, loading, error, isHydrated, isSectionVisible } = useHomepageData()

  // Show skeleton loading while data is being fetched
  if (loading || !isHydrated) {
    return (
      <div className="space-y-8">
        {/* Skeleton for Home Top Banners */}
        <div className="container mx-auto px-4 pt-8">
          <SkeletonBanner />
        </div>

        {/* Hero Section - Always render */}
        <HeroSection />
        
        {/* Circular Collections Carousel - Always render */}
        <CircularCollectionsCarousel />
        
        {/* Skeleton for Home Hero Banners */}
        <div className="container mx-auto px-4 pt-8">
          <SkeletonBanner />
        </div>

        {/* Skeleton for Countdown Timers */}
        <div className="container mx-auto px-4">
          <SkeletonCountdown />
        </div>
        
        {/* Categories Section - Always render */}
        <CategoriesSection />
        
        {/* Collections Section - Always render */}
        <CollectionsSection />
        
        {/* Featured Products - Always render */}
        <FeaturedProducts />
        
        {/* Reviews Carousel - Always render */}
        <ReviewsCarousel />
      </div>
    )
  }

  // Show error state if data fetching failed
  if (error) {
    console.error('Homepage data error:', error)
    // Fallback to basic layout without dynamic content
    return (
      <div className="space-y-8">
        <HeroSection />
        <CircularCollectionsCarousel />
        <CategoriesSection />
        <CollectionsSection />
        <FeaturedProducts />
        <ReviewsCarousel />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Home Top Banners - Slideshow */}
      {isSectionVisible('banners_top') && data?.banners.homeTop.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshow 
            banners={data.banners.homeTop}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Hero Section */}
      {isSectionVisible('hero') && <HeroSection />}

      {/* Circular Collections Carousel */}
      <CircularCollectionsCarousel />

      {/* Home Hero Banners - Slideshow */}
      {isSectionVisible('banners_hero') && data?.banners.homeHero.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshow 
            banners={data.banners.homeHero}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Countdown Timers */}
      {isSectionVisible('countdowns') && data?.countdowns.length > 0 && (
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

      {/* Collections Section */}
      {isSectionVisible('collections') && <CollectionsSection />}

      {/* Featured Products */}
      {isSectionVisible('products') && <FeaturedProducts />}

      {/* Reviews Carousel */}
      <ReviewsCarousel />
    </div>
  )
}
