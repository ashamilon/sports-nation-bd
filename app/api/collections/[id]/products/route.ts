import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch products in a collection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const isFeatured = searchParams.get('isFeatured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const where: any = {
      collectionId: id
    }

    if (isFeatured !== null) {
      where.isFeatured = isFeatured === 'true'
    }

    const collectionProducts = await prisma.collectionProduct.findMany({
      where,
      include: {
        product: {
          include: {
            variants: true,
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // Calculate average ratings for products
    const productsWithRating = collectionProducts.map(cp => {
      const product = cp.product
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...cp,
        product: {
          ...product,
          images: product.images || [],
          averageRating: avgRating,
          reviewCount: product.reviews.length
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: productsWithRating
    })
  } catch (error) {
    console.error('Error fetching collection products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add products to a collection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { productIds, sortOrder, isFeatured } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Product IDs are required' }, { status: 400 })
    }

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if products exist
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Some products not found' }, { status: 400 })
    }

    // Add products to collection
    const collectionProducts = await Promise.all(
      productIds.map((productId, index) =>
        prisma.collectionProduct.create({
          data: {
            collectionId: id,
            productId,
            sortOrder: sortOrder || index,
            isFeatured: isFeatured || false
          },
          include: {
            product: {
              include: {
                variants: true,
                reviews: {
                  select: {
                    rating: true
                  }
                }
              }
            }
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      data: collectionProducts
    })
  } catch (error) {
    console.error('Error adding products to collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

