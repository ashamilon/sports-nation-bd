import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update testimonial
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
    const { name, email, company, position, content, rating, avatar, isActive, isFeatured, order } = body

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (company !== undefined) updateData.company = company
    if (position !== undefined) updateData.position = position
    if (content !== undefined) updateData.content = content
    if (rating !== undefined) updateData.rating = rating
    if (avatar !== undefined) updateData.avatar = avatar
    if (isActive !== undefined) updateData.isActive = isActive
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (order !== undefined) updateData.order = order

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: updatedTestimonial })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial
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

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

