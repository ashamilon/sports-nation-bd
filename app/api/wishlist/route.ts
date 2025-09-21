import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Get or create wishlist for user (ultra-optimized - no includes)
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id }
    })

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { 
          id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          updatedAt: new Date()
        }
      })
    }

    // Get wishlist items with full product data for dashboard display
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      include: {
        Product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            images: true,
            stock: true,
            isActive: true,
            Category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            ProductVariant: {
              select: {
                id: true,
                name: true,
                value: true,
                price: true,
                stock: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data to match the expected format
    const transformedItems = wishlistItems.map(item => {
      // Handle images - could be JSON string or already an array
      let firstImage = '/api/placeholder/300/300'
      try {
        let imageArray
        if (Array.isArray(item.Product.images)) {
          // Already an array
          imageArray = item.Product.images
        } else {
          // JSON string, need to parse
          imageArray = JSON.parse(item.Product.images || '[]')
        }
        firstImage = imageArray[0] || '/api/placeholder/300/300'
      } catch {
        firstImage = '/api/placeholder/300/300'
      }

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: item.Product.id,
          name: item.Product.name,
          slug: item.Product.slug,
          price: item.Product.price,
          comparePrice: item.Product.comparePrice,
          images: firstImage,
          stock: item.Product.stock,
          isActive: item.Product.isActive,
          category: {
            id: item.Product.Category.id,
            name: item.Product.Category.name,
            slug: item.Product.Category.slug
          },
          variants: item.Product.ProductVariant
        },
        variant: item.variantId ? item.Product.ProductVariant.find(v => v.id === item.variantId) : null
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: transformedItems 
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { productId, variantId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get or create wishlist for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id }
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { 
          id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          updatedAt: new Date()
        }
      })
    }

    // Check if item already exists in wishlist
    let existingItem = null
    if (variantId) {
      existingItem = await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId_variantId: {
            wishlistId: wishlist.id,
            productId,
            variantId
          }
        }
      })
    } else {
      // For products without variants, check if any wishlist item exists for this product
      existingItem = await prisma.wishlistItem.findFirst({
        where: {
          wishlistId: wishlist.id,
          productId,
          variantId: null
        }
      })
    }

    if (existingItem) {
      return NextResponse.json(
        { success: false, message: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Add item to wishlist (optimized - no includes for faster response)
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        id: `wishlist-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        wishlistId: wishlist.id,
        productId,
        variantId: variantId || null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: { id: wishlistItem.id, productId, variantId },
      message: 'Item added to wishlist' 
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const productId = searchParams.get('productId')
    const variantId = searchParams.get('variantId')

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id }
    })

    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      )
    }

    let deletedItem = null

    if (itemId) {
      // Remove by itemId (for direct item removal)
      deletedItem = await prisma.wishlistItem.delete({
        where: { id: itemId }
      })
    } else if (productId) {
      // Remove by productId and variantId (for toggle functionality)
      if (variantId) {
        deletedItem = await prisma.wishlistItem.deleteMany({
          where: {
            wishlistId: wishlist.id,
            productId,
            variantId
          }
        })
      } else {
        deletedItem = await prisma.wishlistItem.deleteMany({
          where: {
            wishlistId: wishlist.id,
            productId,
            variantId: null
          }
        })
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Item ID or Product ID is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Item removed from wishlist' 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}
