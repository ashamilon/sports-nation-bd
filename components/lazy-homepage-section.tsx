"use client"

import { Suspense, lazy } from 'react'
import { SkeletonCard, SkeletonSection } from './skeleton-loading'

// Lazy load components
const CircularCollectionsCarousel = lazy(() => import('./circular-collections-carousel'))
const FeaturedProducts = lazy(() => import('./featured-products'))
const ExclusiveProducts = lazy(() => import('./exclusive-products'))
const ReviewsCarousel = lazy(() => import('./reviews-carousel'))

interface LazyHomepageSectionProps {
  component: 'circular-carousel' | 'featured-products' | 'exclusive-products' | 'reviews'
  className?: string
}

export default function LazyHomepageSection({ component, className = "" }: LazyHomepageSectionProps) {
  const renderComponent = () => {
    switch (component) {
      case 'circular-carousel':
        return <CircularCollectionsCarousel />
      case 'featured-products':
        return <FeaturedProducts />
      case 'exclusive-products':
        return <ExclusiveProducts />
      case 'reviews':
        return <ReviewsCarousel />
      default:
        return null
    }
  }

  const renderSkeleton = () => {
    switch (component) {
      case 'circular-carousel':
        return (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          </section>
        )
      case 'featured-products':
        return <SkeletonSection title="Featured Products" className="py-8 md:py-16 lg:py-24" />
      case 'exclusive-products':
        return (
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64 mx-auto" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </section>
        )
      case 'reviews':
        return (
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64 mx-auto" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <Suspense fallback={renderSkeleton()}>
      <div className={className}>
        {renderComponent()}
      </div>
    </Suspense>
  )
}
