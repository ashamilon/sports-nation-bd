import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/reviews - Get all reviews with admin filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const rating = searchParams.get('rating')
    const isVerified = searchParams.get('isVerified')
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')

    const offset = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        {
          comment: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          User: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          User: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          Product: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    if (isVerified !== null && isVerified !== undefined) {
      where.isVerified = isVerified === 'true'
    }

    if (productId) {
      where.productId = productId
    }

    if (userId) {
      where.userId = userId
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
              slug: true
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

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        total,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching admin reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
