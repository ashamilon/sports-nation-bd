import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const content = await prisma.siteContent.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update content item
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
    const { key, title, content, type, category, isActive, metadata } = body

    // Check if content exists
    const existingContent = await prisma.siteContent.findUnique({
      where: { id }
    })

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (key !== undefined) updateData.key = key
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (type !== undefined) updateData.type = type
    if (category !== undefined) updateData.category = category
    if (isActive !== undefined) updateData.isActive = isActive
    if (metadata !== undefined) updateData.metadata = metadata ? JSON.stringify(metadata) : null

    const updatedContent = await prisma.siteContent.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: updatedContent })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE - Delete content item
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

    // Check if content exists
    const existingContent = await prisma.siteContent.findUnique({
      where: { id }
    })

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      )
    }

    await prisma.siteContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}

