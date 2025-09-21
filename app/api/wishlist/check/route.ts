import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Check if items are in wishlist (optimized for product pages)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('productIds')?.split(',') || []

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id }
    })

    if (!wishlist) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Get wishlist items with minimal data for quick checking
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { 
        wishlistId: wishlist.id,
        productId: { in: productIds }
      },
      select: {
        id: true,
        productId: true,
        variantId: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: wishlistItems 
    })
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check wishlist' },
      { status: 500 }
    )
  }
}
