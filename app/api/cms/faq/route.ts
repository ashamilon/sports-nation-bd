import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const category = searchParams.get('category')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }
    if (category) {
      where.category = category
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: faqs
    })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

// POST - Create FAQ
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
      question,
      answer,
      category,
      order,
      isActive
    } = body

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'general',
        order: order || 0,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      data: faq
    })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}
