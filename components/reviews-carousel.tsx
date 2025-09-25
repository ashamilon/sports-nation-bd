'use client'

import { useState, useEffect, memo } from 'react'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

const ReviewsCarousel = memo(function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-muted/30 dark:bg-black-90/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white" style={{ color: '#27355C' }}>Customer Reviews</h2>
          <p className="dark:text-white" style={{ color: '#27355C' }}>What our customers are saying</p>
          <div className="mt-8 flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-white dark:bg-black-90 rounded-lg shadow-lg p-6 border border-border/50 dark:border-black-80 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="h-4 w-4 text-gray-300 dark:text-gray-600 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 md:py-16 bg-muted/30 dark:bg-black-90/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-red-500">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null // Don't render if no reviews
  }

  return (
    <section className="py-8 md:py-16 bg-muted/30 dark:bg-black-90/30">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white" style={{ color: '#27355C' }}>5-Star Customer Reviews</h2>
        <p className="dark:text-white max-w-2xl mx-auto mb-8" style={{ color: '#27355C' }}>What our satisfied customers are saying</p>

        <div className="reviews-container">
          <div className="reviews-track">
            {/* First set of reviews */}
            {reviews.map(review => (
              <div key={`first-${review.id}`} className="review-card">
                {/* Header with user info and rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-sm">
                      {review.User.image ? (
                        <Image
                          src={review.User.image}
                          alt={review.User.name}
                          width={80}
                          height={80}
                          className="w-10 h-10 rounded-full object-cover"
                          quality={100}
                          priority={false}
                          unoptimized={true}
                          sizes="40px"
                        />
                      ) : (
                        <span className="text-white text-lg font-semibold">
                          {review.User.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm dark:text-black" style={{ color: '#27355C' }}>{review.User.name}</h4>
                      <p className="text-xs dark:text-black" style={{ color: '#27355C' }}>{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} fill-current`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product info */}
                <div className="flex items-center space-x-2 text-sm dark:text-black mb-4" style={{ color: '#27355C' }}>
                  <span>Reviewed:</span>
                  <Link href={`/product/${review.Product.slug}`} className="font-medium hover:text-primary transition-colors dark:text-black" style={{ color: '#27355C' }}>
                    {review.Product.name}
                  </Link>
                </div>

                {/* Review comment */}
                <div className="relative bg-muted/20 dark:bg-black-80 p-4 rounded-lg">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
                  <p className="text-sm dark:text-black leading-relaxed pl-4" style={{ color: '#27355C' }}>
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
            ))}
            
            {/* Duplicate set for seamless loop */}
            {reviews.map(review => (
              <div key={`second-${review.id}`} className="review-card">
                {/* Header with user info and rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-sm">
                      {review.User.image ? (
                        <Image
                          src={review.User.image}
                          alt={review.User.name}
                          width={80}
                          height={80}
                          className="w-10 h-10 rounded-full object-cover"
                          quality={100}
                          priority={false}
                          unoptimized={true}
                          sizes="40px"
                        />
                      ) : (
                        <span className="text-white text-lg font-semibold">
                          {review.User.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm dark:text-black" style={{ color: '#27355C' }}>{review.User.name}</h4>
                      <p className="text-xs dark:text-black" style={{ color: '#27355C' }}>{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} fill-current`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product info */}
                <div className="flex items-center space-x-2 text-sm dark:text-black mb-4" style={{ color: '#27355C' }}>
                  <span>Reviewed:</span>
                  <Link href={`/product/${review.Product.slug}`} className="font-medium hover:text-primary transition-colors dark:text-black" style={{ color: '#27355C' }}>
                    {review.Product.name}
                  </Link>
                </div>

                {/* Review comment */}
                <div className="relative bg-muted/20 dark:bg-black-80 p-4 rounded-lg">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
                  <p className="text-sm dark:text-black leading-relaxed pl-4" style={{ color: '#27355C' }}>
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
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .reviews-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        .reviews-track {
          display: flex;
          animation: scroll 30s linear infinite;
          gap: 1.5rem;
        }
        
        .review-card {
          flex-shrink: 0;
          width: 20rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        
        .review-card img {
          border-radius: 50% !important;
          object-fit: cover !important;
          width: 40px !important;
          height: 40px !important;
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          clip-path: circle(50% at 50% 50%) !important;
          -webkit-clip-path: circle(50% at 50% 50%) !important;
          aspect-ratio: 1 / 1 !important;
          flex-shrink: 0 !important;
        }
        
        .review-card .w-10.h-10 {
          border-radius: 50% !important;
          overflow: hidden !important;
          width: 40px !important;
          height: 40px !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .review-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .dark .review-card {
          background: #1a1a1a;
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .reviews-track:hover {
          animation-play-state: paused;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .reviews-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
})

export default ReviewsCarousel