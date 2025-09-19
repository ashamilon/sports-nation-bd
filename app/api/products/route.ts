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
      where.categoryId = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        Category: true
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform products to include proper images and ratings
    const productsWithRating = products.map(product => ({
      ...product,
      images: product.images || [],
      averageRating: 4.5, // Default rating
      reviewCount: 0,
      category: product.Category ? {
        name: product.Category.name,
        slug: product.Category.slug
      } : {
        name: 'Unknown Category',
        slug: 'unknown'
      }
    }))

    return NextResponse.json({
      success: true,
      data: productsWithRating,
      pagination: {
        limit,
        offset,
        total: products.length
      }
    })
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
