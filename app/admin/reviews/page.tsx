"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Search, Filter, MoreVertical, CheckCircle, XCircle, Eye, Trash2, Calendar, User, Shield, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Review {
  id: string
  rating: number
  comment: string | null
  isVerified: boolean
  isModerated: boolean
  isApproved: boolean
  createdAt: string
  User: {
    id: string
    name: string | null
    image: string | null
    email: string
  }
  Product: {
    id: string
    name: string
    slug: string
  }
}

export default function AdminReviewsPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const [moderatingReview, setModeratingReview] = useState<string | null>(null)
  const [moderationReason, setModerationReason] = useState('')

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(ratingFilter && { rating: ratingFilter }),
        ...(verifiedFilter && { isVerified: verifiedFilter })
      })

      const response = await fetch(`/api/admin/reviews?${params}`)
      const result = await response.json()

      if (result.success) {
        setReviews(result.data.reviews)
        setTotalPages(result.data.totalPages)
        setTotalReviews(result.data.total)
      } else {
        toast.error(result.error || 'Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchReviews()
    }
  }, [session, currentPage, searchTerm, ratingFilter, verifiedFilter])

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
      } else {
        toast.error(result.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reason: moderationReason || null
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setModeratingReview(null)
        setModerationReason('')
        fetchReviews()
      } else {
        toast.error(result.error || 'Failed to moderate review')
      }
    } catch (error) {
      console.error('Error moderating review:', error)
      toast.error('Failed to moderate review')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email[0].toUpperCase()
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and ratings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.isVerified).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Ratings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.rating <= 2).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* Verified Filter */}
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Reviews</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRatingFilter('')
                  setVerifiedFilter('')
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {review.User.image ? (
                            <Image
                              src={review.User.image}
                              alt={review.User.name || 'User'}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {getUserInitials(review.User.name, review.User.email)}
                              </span>
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {review.User.name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.User.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{review.Product.name}</div>
                        <div className="text-sm text-gray-500">{review.Product.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
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
                            {review.rating}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {review.comment || 'No comment'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          review.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {review.isVerified ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            'Unverified'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/product/${review.Product.slug}`, '_blank')}
                            className="text-primary hover:text-primary/80 transition-colors"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {/* Moderation Buttons */}
                          {!review.isModerated && (
                            <>
                              <button
                                onClick={() => handleModerateReview(review.id, 'approve')}
                                className="text-green-600 hover:text-green-800 transition-colors"
                                title="Approve Review"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setModeratingReview(review.id)
                                  setModerationReason('')
                                }}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Reject Review"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Moderation Modal */}
        {moderatingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Review
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this review:
              </p>
              <textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Reason for rejection..."
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setModeratingReview(null)
                    setModerationReason('')
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleModerateReview(moderatingReview, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
