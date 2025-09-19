import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch all collections with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeChildren = searchParams.get('includeChildren') === 'true'

    const where: any = {}
    
    if (parentId !== null) {
      where.parentId = parentId === 'null' ? null : parentId
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === 'true'
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        Collection: true, // parent relationship
        other_Collection: includeChildren ? true : false, // children relationship
        _count: {
          select: {
            other_Collection: true,
            CollectionProduct: true
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: collections
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, parentId, isActive, isFeatured, sortOrder, metadata } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingCollection = await prisma.collection.findUnique({
      where: { slug }
    })

    if (existingCollection) {
      return NextResponse.json({ error: 'Collection with this name already exists' }, { status: 400 })
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        sortOrder: sortOrder || 0,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            children: true,
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: collection
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
