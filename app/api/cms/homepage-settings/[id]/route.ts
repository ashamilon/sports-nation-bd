import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch single homepage setting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const setting = await prisma.homepageSettings.findUnique({
      where: { id }
    })

    if (!setting) {
      return NextResponse.json(
        { success: false, error: 'Homepage setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: setting
    })
  } catch (error) {
    console.error('Error fetching homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage setting' },
      { status: 500 }
    )
  }
}

// PUT - Update homepage setting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sectionName, isVisible, sortOrder, metadata } = body

    const updateData: any = {}
    if (sectionName !== undefined) updateData.sectionName = sectionName
    if (isVisible !== undefined) updateData.isVisible = isVisible
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder
    if (metadata !== undefined) updateData.metadata = metadata ? JSON.stringify(metadata) : null

    const setting = await prisma.homepageSettings.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: setting
    })
  } catch (error) {
    console.error('Error updating homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage setting' },
      { status: 500 }
    )
  }
}

// DELETE - Delete homepage setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.homepageSettings.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage setting deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete homepage setting' },
      { status: 500 }
    )
  }
}

