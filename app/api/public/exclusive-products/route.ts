import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // First try to get products that are marked as exclusive and visible
    let products = await prisma.product.findMany({
      where: {
        isActive: true,
        ExclusiveProductSettings: {
          isVisible: true
        }
      },
      include: {
        ExclusiveProductSettings: true,
        Category: true,
        ProductVariant: true,
        Review: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { ExclusiveProductSettings: { sortOrder: 'asc' } },
        { name: 'asc' },
      ],
      take: limit,
    })

    // Get total count of exclusive products
    let totalCount = await prisma.product.count({
      where: {
        isActive: true,
        ExclusiveProductSettings: {
          isVisible: true
        }
      }
    })

    // If no exclusive products found, fallback to featured products
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true
        },
        include: {
          ExclusiveProductSettings: true,
          Category: true,
          ProductVariant: true,
          Review: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
        ],
        take: limit,
      })

      // Get total count of featured products as fallback
      totalCount = await prisma.product.count({
        where: {
          isActive: true,
          isFeatured: true
        }
      })
    }

    // Calculate average ratings and format products
    const productsWithRatings = products.map(product => {
      const reviews = product.Review || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      
      // Get the first variant's price as the main price
      const firstVariant = product.ProductVariant?.[0]
      let price = 0
      let comparePrice = null
      
      if (firstVariant?.sizes) {
        try {
          const sizes = JSON.parse(firstVariant.sizes)
          const firstSize = sizes[0]
          price = firstSize?.price || 0
        } catch (e) {
          // If parsing fails, try the variant's direct price
          price = firstVariant?.price || product.price || 0
        }
      } else {
        // If no sizes, use variant price or fallback to product base price
        price = firstVariant?.price || product.price || 0
      }
      
      // Compare price comes from the main product, not variants
      comparePrice = product.comparePrice || null
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        comparePrice,
        images: product.images || [],
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
        variants: product.ProductVariant || [],
        isNew: false,
        category: product.Category?.name || null,
        sortOrder: product.ExclusiveProductSettings?.sortOrder || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: productsWithRatings,
      totalCount,
    })
  } catch (error) {
    console.error('Error fetching exclusive products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exclusive products' },
      { status: 500 }
    )
  }
}
