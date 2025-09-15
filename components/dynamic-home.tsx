"use client"

import { useBanners, useCountdowns } from '@/lib/hooks/use-cms'
import { useHomepageSettings } from '@/lib/hooks/use-homepage-settings'
import BannerSlideshow from '@/components/banner-slideshow'
import CountdownTimer from '@/components/countdown-timer'
import HeroSection from '@/components/hero-section'
import CategoriesSection from '@/components/categories-section'
import CollectionsSection from '@/components/collections-section'
import FeaturedProducts from '@/components/featured-products'

export default function DynamicHome() {
  const { banners: homeTopBanners, loading: bannersLoading, isHydrated: bannersHydrated } = useBanners('home_top')
  const { banners: homeHeroBanners, loading: heroBannersLoading, isHydrated: heroBannersHydrated } = useBanners('home_hero')
  const { countdowns, loading: countdownsLoading, isHydrated: countdownsHydrated } = useCountdowns('home')
  const { isSectionVisible, isHydrated: settingsHydrated } = useHomepageSettings()

  // Don't render dynamic content until hydrated to prevent hydration mismatches
  if (!bannersHydrated || !heroBannersHydrated || !countdownsHydrated || !settingsHydrated) {
    return (
      <div className="space-y-8">
        {/* Hero Section - Always render */}
        <HeroSection />
        
        {/* Categories Section - Always render */}
        <CategoriesSection />
        
        {/* Collections Section - Always render */}
        <CollectionsSection />
        
        {/* Featured Products - Always render */}
        <FeaturedProducts />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Home Top Banners - Slideshow */}
      {isSectionVisible('banners_top') && !bannersLoading && homeTopBanners.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshow 
            banners={homeTopBanners}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Hero Section */}
      {isSectionVisible('hero') && <HeroSection />}

      {/* Home Hero Banners - Slideshow */}
      {isSectionVisible('banners_hero') && !heroBannersLoading && homeHeroBanners.length > 0 && (
        <div className="container mx-auto px-4 pt-8">
          <BannerSlideshow 
            banners={homeHeroBanners}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Countdown Timers */}
      {isSectionVisible('countdowns') && !countdownsLoading && countdowns.length > 0 && (
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {countdowns.map((countdown) => (
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
    </div>
  )
}
