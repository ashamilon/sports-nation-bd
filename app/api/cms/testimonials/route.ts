import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    } else if (active === 'false') {
      // When explicitly requesting inactive items, show all (for admin)
      // No additional filters
    }
    if (featured === 'true') {
      where.isFeatured = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.testimonial.count({ where })

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST - Create testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      company,
      position,
      content,
      rating,
      avatar,
      isActive,
      isFeatured,
      order
    } = body

    const testimonial = await prisma.testimonial.create({
      data: {
        id: `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        company,
        position,
        content,
        rating: rating || 5,
        avatar,
        isActive: isActive !== false,
        isFeatured: isFeatured || false,
        order: order || 0,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: testimonial
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
