'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  User: {
    id: string
    name: string
    image: string | null
  }
  Product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fetch 5-star reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/reviews?rating=5&limit=20')
        const data = await response.json()
        
        if (data.success) {
          setReviews(data.data || [])
        } else {
          setError('Failed to fetch reviews')
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to fetch reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (reviews.length === 0) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollAmount = 0
    const scrollSpeed = 0.5 // pixels per frame
    const cardWidth = 320 // approximate card width + gap

    const scroll = () => {
      scrollAmount += scrollSpeed
      scrollContainer.scrollLeft = scrollAmount

      // Reset scroll position when we've scrolled past all cards
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0
      }

      requestAnimationFrame(scroll)
    }

    // Start scrolling after a short delay
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scroll)
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [reviews])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30 dark:bg-black-90/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white-100">Customer Reviews</h2>
            <p className="text-muted-foreground dark:text-white-80">What our customers are saying</p>
          </div>
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-48 bg-muted dark:bg-black-80 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || reviews.length === 0) {
    return null // Don't show section if no reviews
  }

  return (
    <section className="py-16 bg-muted/30 dark:bg-black-90/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white-100">5-Star Customer Reviews</h2>
          <p className="text-muted-foreground dark:text-white-80">What our satisfied customers are saying</p>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Duplicate reviews for seamless infinite scroll */}
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateComment = (comment: string, maxLength: number = 120) => {
    if (comment.length <= maxLength) return comment
    return comment.substring(0, maxLength) + '...'
  }

  return (
    <div className="flex-shrink-0 w-80 bg-white dark:bg-black-90 rounded-lg shadow-lg p-6 border border-border/50 dark:border-black-80 hover:shadow-xl transition-shadow duration-300">
      {/* Header with user info and rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-sm">
            {review.User.image ? (
              <Image
                src={review.User.image}
                alt={review.User.name}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
                style={{ objectFit: 'cover' }}
                unoptimized={review.User.image.includes('/uploads/')}
                priority={false}
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {review.User.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground dark:text-white-100">{review.User.name}</h4>
            <p className="text-xs text-muted-foreground dark:text-white-70">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        
        {/* 5-star rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
      </div>

      {/* Product info */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-white-70">
          <span>Reviewed:</span>
          <span className="font-medium text-foreground dark:text-white-100">{review.Product.name}</span>
        </div>
      </div>

      {/* Review comment */}
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
        <p className="text-sm text-muted-foreground dark:text-white-80 leading-relaxed pl-4">
          "{truncateComment(review.comment)}"
        </p>
      </div>

      {/* Verified badge */}
      <div className="mt-4 flex items-center justify-end">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-sm">
          ✓ Verified Purchase
        </span>
      </div>
    </div>
  )
}
