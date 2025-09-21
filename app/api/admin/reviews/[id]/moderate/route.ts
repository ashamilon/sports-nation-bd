import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/reviews/[id]/moderate - Moderate a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const { action, reason } = body // action: 'approve' | 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be approve or reject' }, { status: 400 })
    }

    const { id } = await params

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved: action === 'approve',
        isModerated: true,
        moderatedBy: session.user.id,
        moderationReason: reason || null,
        moderatedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
        Product: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        Moderator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: `Review ${action}d successfully`
    })
  } catch (error) {
    console.error('Error moderating review:', error)
    return NextResponse.json(
      { error: 'Failed to moderate review' },
      { status: 500 }
    )
  }
}
