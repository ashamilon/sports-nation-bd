import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch specific size chart
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sizeChart = await prisma.siteContent.findUnique({
      where: { id }
    })

    if (!sizeChart) {
      return NextResponse.json({ error: 'Size chart not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: sizeChart })
  } catch (error) {
    console.error('Error fetching size chart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update size chart
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { fabricType, title, content, isActive, metadata } = body

    if (!fabricType || !content) {
      return NextResponse.json({ error: 'Fabric type and content are required' }, { status: 400 })
    }

    const sizeChart = await prisma.siteContent.update({
      where: { id },
      data: {
        key: `size_chart_${fabricType.toLowerCase().replace(/\s+/g, '_')}`,
        title: title || `${fabricType} Size Chart`,
        content,
        isActive: isActive !== undefined ? isActive : true,
        metadata: metadata ? JSON.stringify(metadata) : JSON.stringify({ fabricType }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, data: sizeChart })
  } catch (error) {
    console.error('Error updating size chart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete size chart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.siteContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Size chart deleted successfully' })
  } catch (error) {
    console.error('Error deleting size chart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
