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
    const isInCarousel = searchParams.get('isInCarousel')
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
    
    if (isInCarousel !== null) {
      where.isInCarousel = isInCarousel === 'true'
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

    const response = NextResponse.json({
      success: true,
      data: collections
    })
    
    // Add caching headers for better performance (only for public requests)
    if (isActive !== false) {
      response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600') // 10 minutes cache
      response.headers.set('Vary', 'Accept-Encoding')
    } else {
      // Disable caching for admin requests (when isActive=false)
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    
    return response
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new collection
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/collections - Starting request')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { name, description, image, parentId, isActive, isFeatured, sortOrder, metadata, isInCarousel, carouselOrder } = body

    if (!name) {
      console.log('Validation failed - name is required')
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    console.log('Generated slug:', slug)
    const existingCollection = await prisma.collection.findUnique({
      where: { slug }
    })

    if (existingCollection) {
      console.log('Validation failed - slug already exists:', slug)
      return NextResponse.json({ error: 'Collection with this name already exists' }, { status: 400 })
    }

    // Generate unique ID for the collection
    const id = `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const collection = await prisma.collection.create({
      data: {
        id,
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        sortOrder: sortOrder || 0,
        isInCarousel: isInCarousel !== undefined ? isInCarousel : false,
        carouselOrder: carouselOrder || 0,
        metadata: metadata ? JSON.stringify(metadata) : null,
        updatedAt: new Date()
      },
      include: {
        Collection: true, // parent relationship
        other_Collection: true, // children relationship
        _count: {
          select: {
            other_Collection: true,
            CollectionProduct: true
          }
        }
      }
    })

    console.log('Collection created successfully:', collection.id, collection.name)
    
    // Trigger real-time update event for collections
    const response = NextResponse.json({
      success: true,
      data: collection
    })
    
    // Add header to indicate collections were updated
    response.headers.set('X-Collections-Updated', 'true')
    
    return response
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
