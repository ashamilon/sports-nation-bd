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

    // Get or create wishlist for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                variants: true
              }
            },
            variant: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  variants: true
                }
              },
              variant: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: wishlist.items 
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
        data: { userId: session.user.id }
      })
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId_variantId: {
          wishlistId: wishlist.id,
          productId,
          variantId: variantId || null
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { success: false, message: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
        variantId: variantId || null
      },
      include: {
        product: {
          include: {
            category: true,
            variants: true
          }
        },
        variant: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: wishlistItem,
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

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      )
    }

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

    // Remove item from wishlist
    await prisma.wishlistItem.delete({
      where: { id: itemId }
    })

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
