import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single countdown timer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const countdown = await prisma.countdownTimer.findUnique({
      where: { id }
    })

    if (!countdown) {
      return NextResponse.json({ success: false, error: 'Countdown timer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: countdown })
  } catch (error) {
    console.error('Error fetching countdown timer:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update countdown timer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, targetDate, type, targetId, isActive, position, priority, metadata } = body

    // Check if countdown exists
    const existingCountdown = await prisma.countdownTimer.findUnique({
      where: { id }
    })

    if (!existingCountdown) {
      return NextResponse.json(
        { success: false, error: 'Countdown timer not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (targetDate !== undefined) updateData.targetDate = new Date(targetDate)
    if (type !== undefined) updateData.type = type
    if (targetId !== undefined) updateData.targetId = targetId
    if (isActive !== undefined) updateData.isActive = isActive
    if (position !== undefined) updateData.position = position
    if (priority !== undefined) updateData.priority = priority
    if (metadata !== undefined) updateData.metadata = metadata ? JSON.stringify(metadata) : null

    const updatedCountdown = await prisma.countdownTimer.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: updatedCountdown })
  } catch (error) {
    console.error('Error updating countdown timer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update countdown timer' },
      { status: 500 }
    )
  }
}

// DELETE - Delete countdown timer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if countdown exists
    const existingCountdown = await prisma.countdownTimer.findUnique({
      where: { id }
    })

    if (!existingCountdown) {
      return NextResponse.json(
        { success: false, error: 'Countdown timer not found' },
        { status: 404 }
      )
    }

    await prisma.countdownTimer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Countdown timer deleted successfully' })
  } catch (error) {
    console.error('Error deleting countdown timer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete countdown timer' },
      { status: 500 }
    )
  }
}

