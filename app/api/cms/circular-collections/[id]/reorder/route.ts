import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT - Reorder collection in carousel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { direction } = body

    if (!direction || !['up', 'down'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid direction. Must be "up" or "down"' }, { status: 400 })
    }

    // Get current collection
    const currentCollection = await prisma.collection.findUnique({
      where: { id },
      select: {
        id: true,
        carouselOrder: true,
        isInCarousel: true
      }
    })

    if (!currentCollection || !currentCollection.isInCarousel) {
      return NextResponse.json({ error: 'Collection not found or not in carousel' }, { status: 404 })
    }

    // Get all collections in carousel ordered by carouselOrder
    const carouselCollections = await prisma.collection.findMany({
      where: {
        isInCarousel: true
      },
      orderBy: {
        carouselOrder: 'asc'
      },
      select: {
        id: true,
        carouselOrder: true
      }
    })

    const currentIndex = carouselCollections.findIndex(c => c.id === id)
    
    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Collection not found in carousel' }, { status: 404 })
    }

    // Check if move is valid
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === carouselCollections.length - 1)) {
      return NextResponse.json({ error: 'Cannot move collection in this direction' }, { status: 400 })
    }

    // Swap with adjacent collection
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetCollection = carouselCollections[targetIndex]

    // Update both collections
    await prisma.$transaction([
      prisma.collection.update({
        where: { id },
        data: { carouselOrder: targetCollection.carouselOrder }
      }),
      prisma.collection.update({
        where: { id: targetCollection.id },
        data: { carouselOrder: currentCollection.carouselOrder }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Collection order updated successfully'
    })
  } catch (error) {
    console.error('Error reordering collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
