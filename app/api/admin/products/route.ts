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
          Category: {
            select: {
              name: true
            }
          },
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
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Format products for display
    const formattedProducts = products.map(product => {
      // Calculate total stock from all variants
      let totalStock = 0
      
      if (product.ProductVariant && product.ProductVariant.length > 0) {
        product.ProductVariant.forEach(variant => {
          if (variant.fabricType && variant.sizes) {
            // Jersey variant with sizes array
            try {
              const sizes = typeof variant.sizes === 'string' ? JSON.parse(variant.sizes) : variant.sizes
              if (Array.isArray(sizes)) {
                sizes.forEach(sizeItem => {
                  totalStock += sizeItem.stock || 0
                })
              }
            } catch (error) {
              console.error('Error parsing sizes for variant:', error)
            }
          } else if (variant.stock !== null && variant.stock !== undefined) {
            // Simple variant with direct stock
            totalStock += variant.stock
          }
        })
      }

      // Calculate average rating from reviews
      const reviews = product.Review || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images || [],
        category: product.Category,
        status: product.isActive ? 'active' : 'inactive',
        stock: totalStock,
        sales: 0, // Default sales count since Product model doesn't have salesCount field
        revenue: `৳0`, // Default revenue since we don't have sales data
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: reviews.length,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      comparePrice,
      categoryId, 
      images, 
      variants, 
      selectedBadges,
      allowNameNumber,
      nameNumberPrice,
      isFeatured,
      isActive
    } = body

    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug and SKU
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 4)
    const slug = `${baseSlug}-${timestamp}-${randomSuffix}`
    const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Transform variants for database storage
    const transformedVariants = variants?.map((variant: any) => {
      if (variant.fabricType) {
        // Jersey variant with fabric type and sizes
        return {
          fabricType: variant.fabricType,
          sizes: JSON.stringify(variant.sizes),
          name: null,
          value: null,
          price: null,
          stock: 0
        }
      } else {
        // Simple variant
        return {
          fabricType: null,
          sizes: null,
          name: variant.name || '',
          value: variant.value || '',
          price: variant.price || 0,
          stock: variant.stock || 0
        }
      }
    }) || []

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description: description || '',
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        categoryId,
        images: images || [],
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        allowNameNumber: allowNameNumber || false,
        nameNumberPrice: nameNumberPrice ? parseFloat(nameNumberPrice) : 250,
        selectedBadges: selectedBadges ? JSON.stringify(selectedBadges) : null,
        ProductVariant: {
          create: transformedVariants
        }
      },
      include: {
        Category: true,
        ProductVariant: true
      }
    })

    // Handle badge associations if selectedBadges is provided
    if (selectedBadges && selectedBadges.length > 0) {
      // For now, we'll just log the selected badges since the ProductBadge model might not be set up yet
      console.log('Selected badges for product:', selectedBadges)
      console.log('Product created with customization options:', {
        allowNameNumber: allowNameNumber || false,
        nameNumberPrice: nameNumberPrice ? parseFloat(nameNumberPrice) : 250
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: product.images || []
      }
    })
  } catch (error) {
    console.error('Error creating product:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}