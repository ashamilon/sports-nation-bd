"use client"

import { useState, useEffect } from 'react'
import { Star, TrendingUp } from 'lucide-react'

interface ReviewsSummaryProps {
  productId: string
}

interface ReviewsData {
  reviews: any[]
  total: number
  averageRating: number
  ratingDistribution: Array<{
    rating: number
    count: number
  }>
}

export default function ReviewsSummary({ productId }: ReviewsSummaryProps) {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviewsSummary = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error('Error fetching reviews summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviewsSummary()
  }, [productId])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-32 rounded-lg"></div>
      </div>
    )
  }

  if (!data || data.total === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    )
  }

  const getRatingPercentage = (rating: number) => {
    const count = data.ratingDistribution.find(r => r.rating === rating)?.count || 0
    return (count / data.total) * 100
  }

  const getRatingLabel = (rating: number) => {
    const labels = {
      5: 'Excellent',
      4: 'Very Good',
      3: 'Good',
      2: 'Fair',
      1: 'Poor'
    }
    return labels[rating as keyof typeof labels]
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="text-4xl font-bold text-gray-900 mr-2">
              {data.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Based on {data.total} review{data.total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Customer Rating</span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Rating Breakdown</h4>
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = getRatingPercentage(rating)
            const count = data.ratingDistribution.find(r => r.rating === rating)?.count || 0
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-20">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-400">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{data.total}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.ratingDistribution.find(r => r.rating >= 4)?.count || 0}
            </div>
            <div className="text-sm text-gray-600">Positive (4-5★)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {data.ratingDistribution.find(r => r.rating === 3)?.count || 0}
            </div>
            <div className="text-sm text-gray-600">Neutral (3★)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {data.ratingDistribution.find(r => r.rating <= 2)?.count || 0}
            </div>
            <div className="text-sm text-gray-600">Negative (1-2★)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
