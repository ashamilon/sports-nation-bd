import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const faq = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!faq) {
      return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update FAQ
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
    const { question, answer, category, order, isActive } = body

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!existingFAQ) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (question !== undefined) updateData.question = question
    if (answer !== undefined) updateData.answer = answer
    if (category !== undefined) updateData.category = category
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: updatedFAQ })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ' },
      { status: 500 }
    )
  }
}

// DELETE - Delete FAQ
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

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!existingFAQ) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      )
    }

    await prisma.fAQ.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}

