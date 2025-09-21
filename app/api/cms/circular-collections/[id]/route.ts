import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT - Update collection carousel status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { isInCarousel } = body

    if (typeof isInCarousel !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isInCarousel value' }, { status: 400 })
    }

    // Get current collection
    const collection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    let carouselOrder = null

    if (isInCarousel) {
      // Get the highest carousel order and add 1
      const maxOrder = await prisma.collection.findFirst({
        where: {
          isInCarousel: true
        },
        orderBy: {
          carouselOrder: 'desc'
        },
        select: {
          carouselOrder: true
        }
      })

      carouselOrder = (maxOrder?.carouselOrder || 0) + 1
    }

    // Update collection
    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        isInCarousel,
        carouselOrder
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCollection
    })
  } catch (error) {
    console.error('Error updating collection carousel status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
