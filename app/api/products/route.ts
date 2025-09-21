import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isActive: true
    }

    if (category) {
      // Check if category is a slug or ID
      if (category.startsWith('cat_')) {
        // It's a category ID
        where.categoryId = category
      } else {
        // It's a category slug, so we need to find the category first
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: category }
        })
        if (categoryRecord) {
          where.categoryId = categoryRecord.id
        }
      }
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        Category: true,
        ProductVariant: true,
        Review: {
          where: {
            isApproved: true
          },
          select: {
            rating: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform products to include proper images and ratings
    const productsWithRating = products.map(product => {
      const reviews = product.Review || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      const reviewCount = reviews.length

      return {
        ...product,
        images: product.images || [],
        variants: (product.ProductVariant || []).map(variant => ({
          ...variant,
          price: variant.price || undefined
        })),
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount,
        category: product.Category ? {
          name: product.Category.name,
          slug: product.Category.slug
        } : {
          name: 'Unknown Category',
          slug: 'unknown'
        }
      }
    })

    const response = NextResponse.json({
      success: true,
      data: productsWithRating,
      pagination: {
        limit,
        offset,
        total: products.length
      }
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300') // 5 minutes cache
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, categoryId, images, variants } = body

    // Generate slug and SKU
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price,
        categoryId,
        images: images || [],
        variants: {
          create: variants || []
        }
      },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: product.images || []
      }
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
