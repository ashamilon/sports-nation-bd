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
        category: true,
        variants: true
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

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId,
        price,
        comparePrice: comparePrice || null,
        sku,
        stock,
        images: images || [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        weight: weight || null,
        dimensions: dimensions || null
      }
    })

    // Update variants
    if (variants && Array.isArray(variants)) {
      // Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      })

      // Create new variants
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((variant: any) => ({
            name: variant.name,
            value: variant.value,
            price: variant.price || null,
            stock: variant.stock || 0,
            productId: id
          }))
        })
      }
    }

    // Fetch updated product with relations
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true
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
