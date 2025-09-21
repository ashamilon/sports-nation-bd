import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
        ProductVariant: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Images are already an array in the database
    const productWithParsedImages = {
      ...product,
      images: product.images || []
    }

    return NextResponse.json(productWithParsedImages)

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
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
      isActive,
      isFeatured,
      weight,
      dimensions
    } = body

    // Check if this is a partial update (e.g., just toggling active status)
    const isPartialUpdate = Object.keys(body).length === 1 && 'isActive' in body

    if (!isPartialUpdate) {
      // Validate required fields for full updates
      if (!name || !description || !categoryId || !price || !sku) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    
    if (name) {
      updateData.name = name
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (description !== undefined) updateData.description = description
    if (categoryId) updateData.categoryId = categoryId
    if (price !== undefined) updateData.price = price
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice || null
    if (sku) updateData.sku = sku
    if (stock !== undefined) updateData.stock = stock
    if (images !== undefined) updateData.images = images || []
    if (isActive !== undefined) updateData.isActive = isActive
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (weight !== undefined) updateData.weight = weight || null
    if (dimensions !== undefined) updateData.dimensions = dimensions || null

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData
    })

    // Update variants (only if variants are provided)
    if (variants && Array.isArray(variants) && !isPartialUpdate) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      })

      // Create new variants
      if (variants.length > 0) {
        // Transform variants for database storage
        const transformedVariants = variants.map((variant: any) => {
          if (variant.fabricType) {
            // Jersey variant with fabric type and sizes
            return {
              fabricType: variant.fabricType,
              sizes: typeof variant.sizes === 'string' ? variant.sizes : JSON.stringify(variant.sizes),
              name: null,
              value: null,
              price: null,
              stock: 0,
              productId: id
            }
          } else {
            // Simple variant
            return {
              fabricType: null,
              sizes: null,
              name: variant.name,
              value: variant.value,
              price: variant.price || null,
              stock: variant.stock || 0,
              productId: id
            }
          }
        })

        await prisma.productVariant.createMany({
          data: transformedVariants
        })
      }
    }

    // Fetch updated product with relations
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
        ProductVariant: true
      }
    })

    // Parse images from JSON string
    const productWithParsedImages = {
      ...updatedProduct,
      images: updatedProduct?.images || []
    }

    return NextResponse.json({
      success: true,
      product: productWithParsedImages,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product (variants will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
