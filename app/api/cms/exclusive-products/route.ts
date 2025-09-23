import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Get all products with their exclusive settings
    const products = await prisma.product.findMany({
      where: {
        isActive: includeInactive ? undefined : true,
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
    })

    // Calculate average ratings
    const productsWithRatings = products.map(product => {
      const reviews = product.Review || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      
      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      }
    })

    return NextResponse.json({
      success: true,
      data: productsWithRatings,
    })
  } catch (error) {
    console.error('Error fetching exclusive products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exclusive products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productIds, isVisible = true, sortOrder = 0 } = body

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      )
    }

    // Create or update exclusive product settings
    const results = await Promise.all(
      productIds.map(async (productId: string, index: number) => {
        return prisma.exclusiveProductSettings.upsert({
          where: { productId },
          update: {
            isVisible,
            sortOrder: sortOrder + index,
            updatedAt: new Date(),
          },
          create: {
            productId,
            isVisible,
            sortOrder: sortOrder + index,
          },
        })
      })
    )

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} products updated for exclusive section`,
    })
  } catch (error) {
    console.error('Error updating exclusive products:', error)
    return NextResponse.json(
      { error: 'Failed to update exclusive products' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.exclusiveProductSettings.delete({
      where: { productId },
    })

    return NextResponse.json({
      success: true,
      message: 'Product removed from exclusive section',
    })
  } catch (error) {
    console.error('Error removing exclusive product:', error)
    return NextResponse.json(
      { error: 'Failed to remove exclusive product' },
      { status: 500 }
    )
  }
}
