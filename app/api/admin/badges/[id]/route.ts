import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/badges/[id] - Get single badge
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const badge = await prisma.badges.findUnique({
      where: { id }
    })

    if (!badge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 })
    }

    return NextResponse.json({ badge })
  } catch (error) {
    console.error('Error fetching badge:', error)
    return NextResponse.json({ error: 'Failed to fetch badge' }, { status: 500 })
  }
}

// PUT /api/admin/badges/[id] - Update badge
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const badge = await prisma.badges.update({
      where: { id },
      data: {
        name,
        description: description || null,
        image,
        category,
        price: price || 150,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ badge })
  } catch (error) {
    console.error('Error updating badge:', error)
    return NextResponse.json({ error: 'Failed to update badge' }, { status: 500 })
  }
}

// DELETE /api/admin/badges/[id] - Delete badge
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if badge is used in any products
    const productBadges = await prisma.product_badges.findMany({
      where: { badgeId: id }
    })

    if (productBadges.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete badge that is assigned to products' 
      }, { status: 400 })
    }

    await prisma.badges.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Badge deleted successfully' })
  } catch (error) {
    console.error('Error deleting badge:', error)
    return NextResponse.json({ error: 'Failed to delete badge' }, { status: 500 })
  }
}
