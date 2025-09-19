import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/badges - Get all badges
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const badges = await prisma.badge.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}

// POST /api/admin/badges - Create new badge
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, category, price, isActive } = body

    // Validate required fields
    if (!name || !image || !category) {
      return NextResponse.json({ 
        error: 'Name, image, and category are required' 
      }, { status: 400 })
    }

    // Validate category
    const validCategories = [
      'premier-league', 'la-liga', 'serie-a', 'bundesliga', 
      'champions-league', 'national-teams', 'other'
    ]
    
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category' 
      }, { status: 400 })
    }

    const badge = await prisma.badge.create({
      data: {
        name,
        description: description || null,
        image,
        category,
        price: price || 150,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ badge }, { status: 201 })
  } catch (error) {
    console.error('Error creating badge:', error)
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 })
  }
}
