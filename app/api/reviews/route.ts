import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/reviews - Get reviews for a product or all reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const rating = searchParams.get('rating')
    const isVerified = searchParams.get('isVerified')

    const where: any = {
      isApproved: true // Only show approved reviews by default
    }

    // Only require productId if we're fetching reviews for a specific product
    if (productId) {
      where.productId = productId
    }

    if (userId) {
      where.userId = userId
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    if (isVerified !== null && isVerified !== undefined) {
      where.isVerified = isVerified === 'true'
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true
            }
          },
          Product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.review.count({ where })
    ])

    // Calculate average rating (only approved reviews)
    const avgRating = await prisma.review.aggregate({
      where: productId ? { productId, isApproved: true } : { isApproved: true },
      _avg: {
        rating: true
      }
    })

    // Get rating distribution (only approved reviews)
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: productId ? { productId, isApproved: true } : { isApproved: true },
      _count: {
        rating: true
      }
    })

    const distribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1
      const count = ratingDistribution.find(r => r.rating === rating)?._count.rating || 0
      return { rating, count }
    })

    // If no productId, return reviews directly for carousel
    if (!productId) {
      return NextResponse.json({
        success: true,
        data: reviews,
        total
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        total,
        averageRating: avgRating._avg.rating || 0,
        ratingDistribution: distribution,
        pagination: {
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 })
    }

    // Check if user has purchased this product (for verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        Order: {
          userId: session.user.id,
          status: 'completed'
        }
      }
    })

    const review = await prisma.review.create({
      data: {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        productId,
        rating,
        comment: comment || null,
        isVerified: !!hasPurchased,
        updatedAt: new Date()
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
        Product: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: review
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
