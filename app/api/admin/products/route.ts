import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.category = { slug: category }
    }
    
    if (status) {
      where.isActive = status === 'active'
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          _count: {
            select: {
              variants: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    // Parse images from JSON string for each product
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: product.images || []
    }))

    return NextResponse.json({
      products: productsWithParsedImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      name,
      description,
      categoryId,
      price,
      comparePrice,
      sku,
      stock,
      images,
      variants,
      isActive = true,
      isFeatured = false,
      weight,
      dimensions,
      allowNameNumber = false,
      nameNumberPrice = 250
    } = await request.json()

    // Validate required fields
    if (!name || !description || !categoryId || !price || !sku) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Generate unique SKU if not provided or if it already exists
    let finalSku = sku
    if (!finalSku) {
      // Generate SKU from name
      finalSku = name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8)
    }
    
    // Check if SKU already exists and generate a unique one
    let skuExists = true
    let counter = 1
    while (skuExists) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: finalSku }
      })
      
      if (!existingProduct) {
        skuExists = false
      } else {
        finalSku = `${sku || name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6)}-${counter}`
        counter++
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        price,
        comparePrice: comparePrice || null,
        sku: finalSku,
        stock: stock || 0,
        images: images || [],
        isActive,
        isFeatured,
        weight: weight || null,
        dimensions: dimensions || null,
        allowNameNumber,
        nameNumberPrice: allowNameNumber ? nameNumberPrice : null,
        variants: {
          create: (variants || []).filter((variant: any) => variant.name && variant.value)
        }
      },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Product creation error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { message: 'A product with this SKU or slug already exists' },
          { status: 400 }
        )
      }
      if (error.message.includes('Foreign key constraint failed')) {
        return NextResponse.json(
          { message: 'Invalid category selected' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { message: 'Failed to create product', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
