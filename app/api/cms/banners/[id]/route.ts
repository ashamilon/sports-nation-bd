import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const banner = await prisma.banner.findUnique({
      where: { id }
    })

    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update banner
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
    const { title, description, image, link, position, priority, isActive, startsAt, expiresAt, metadata } = body

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    })

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (link !== undefined) updateData.link = link
    if (position !== undefined) updateData.position = position
    if (priority !== undefined) updateData.priority = priority
    if (isActive !== undefined) updateData.isActive = isActive
    if (startsAt !== undefined) updateData.startsAt = startsAt ? new Date(startsAt) : null
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    if (metadata !== undefined) updateData.metadata = metadata ? JSON.stringify(metadata) : null

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

// DELETE - Delete banner
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

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    })

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }

    await prisma.banner.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}

