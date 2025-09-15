import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (category && category !== 'all') {
      where.category = { name: category }
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'sales') {
      orderBy = { createdAt: 'desc' } // Default to creation date since salesCount doesn't exist
    } else if (sortBy === 'price') {
      orderBy = { price: 'desc' }
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Format products for display
    const formattedProducts = products.map(product => ({
      name: product.name,
      sales: 0, // Default sales count since Product model doesn't have salesCount field
      revenue: `৳0`, // Default revenue since we don't have sales data
      image: product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/60/60'
    }))

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}