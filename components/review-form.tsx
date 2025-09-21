"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Send, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewSubmitted?: () => void
  existingReview?: {
    id: string
    rating: number
    comment: string
  }
}

export default function ReviewForm({ 
  productId, 
  productName, 
  onReviewSubmitted,
  existingReview 
}: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error('Please sign in to leave a review')
      return
    }

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const url = existingReview ? `/api/reviews/${existingReview.id}` : '/api/reviews'
      const method = existingReview ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!')
        setRating(0)
        setComment('')
        onReviewSubmitted?.()
      } else {
        toast.error(result.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to leave a review</h3>
        <p className="text-gray-600 mb-4">
          Please sign in to share your experience with {productName}
        </p>
        <button
          onClick={() => window.location.href = '/auth/signin'}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Edit Your Review' : `Write a Review for ${productName}`}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={handleRatingLeave}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Share your experience with this product..."
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              Optional - Help other customers make informed decisions
            </p>
            <span className="text-xs text-gray-400">
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {existingReview ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {existingReview ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Review Guidelines */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Review Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be honest and constructive in your feedback</li>
          <li>• Focus on the product and your experience</li>
          <li>• Avoid personal attacks or inappropriate language</li>
          <li>• Verified purchase reviews are marked with a badge</li>
        </ul>
      </div>
    </div>
  )
}
