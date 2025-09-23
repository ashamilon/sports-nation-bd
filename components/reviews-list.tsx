"use client"

import { useState, useEffect } from 'react'
import { Star, User, Calendar, CheckCircle, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Review {
  id: string
  rating: number
  comment: string | null
  isVerified: boolean
  createdAt: string
  User: {
    id: string
    name: string | null
    image: string | null
    email: string
  }
}

interface ReviewsListProps {
  productId: string
  productName: string
  onReviewUpdate?: () => void
}

export default function ReviewsList({ productId, productName, onReviewUpdate }: ReviewsListProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingReview, setEditingReview] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const result = await response.json()

      if (result.success) {
        setReviews(result.data.reviews)
      } else {
        setError(result.error || 'Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Review deleted successfully')
        fetchReviews()
        onReviewUpdate?.()
      } else {
        toast.error(result.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email[0].toUpperCase()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-24 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-2 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review {productName}!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              {review.User.image ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-sm">
                  <Image
                    src={review.User.image}
                    alt={review.User.name || 'User'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectFit: 'cover' }}
                    unoptimized={review.User.image.includes('/uploads/')}
                    priority={false}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-white/20 shadow-sm">
                  <span className="text-sm font-medium text-primary">
                    {getUserInitials(review.User.name, review.User.email)}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">
                    {review.User.name || 'Anonymous'}
                  </h4>
                  {review.isVerified && (
                    <div title="Verified Purchase">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Review Actions */}
            {session?.user?.id === review.User.id && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingReview(review.id)}
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Edit review"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {review.rating === 1 && 'Poor'}
              {review.rating === 2 && 'Fair'}
              {review.rating === 3 && 'Good'}
              {review.rating === 4 && 'Very Good'}
              {review.rating === 5 && 'Excellent'}
            </span>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
