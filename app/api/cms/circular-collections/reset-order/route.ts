import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST - Reset carousel order to default
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all collections in carousel ordered by their original sortOrder
    const carouselCollections = await prisma.collection.findMany({
      where: {
        isInCarousel: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Update carouselOrder based on sortOrder
    const updatePromises = carouselCollections.map((collection, index) => 
      prisma.collection.update({
        where: { id: collection.id },
        data: { carouselOrder: index + 1 }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Carousel order reset successfully',
      data: {
        updatedCount: carouselCollections.length
      }
    })
  } catch (error) {
    console.error('Error resetting carousel order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
