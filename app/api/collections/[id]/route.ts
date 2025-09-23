import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch a single collection by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeChildren = searchParams.get('includeChildren') === 'true'

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        Collection: true, // parent relationship
        other_Collection: includeChildren ? {
          include: {
            CollectionProduct: includeProducts ? {
              include: {
                product: {
                  include: {
                    variants: true,
                    reviews: {
                      select: {
                        rating: true
                      }
                    }
                  }
                }
              }
            } : false
          }
        } : false,
        CollectionProduct: includeProducts ? {
          include: {
            product: {
              include: {
                variants: true,
                reviews: {
                  select: {
                    rating: true
                  }
                }
              }
            }
          },
          orderBy: {
            sortOrder: 'asc'
          }
        } : false,
        _count: {
          select: {
            other_Collection: true,
            CollectionProduct: true
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: collection
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a collection
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
    const { name, description, image, parentId, isActive, isFeatured, sortOrder, metadata } = body

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Generate slug from name if name is provided
    let slug = existingCollection.slug
    if (name && name !== existingCollection.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if new slug already exists
      const slugExists = await prisma.collection.findUnique({
        where: { slug }
      })

      if (slugExists && slugExists.id !== id) {
        return NextResponse.json({ error: 'Collection with this name already exists' }, { status: 400 })
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(metadata !== undefined && { metadata: metadata ? JSON.stringify(metadata) : null })
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

    // Trigger real-time update event for collections
    const response = NextResponse.json({
      success: true,
      data: collection
    })
    
    // Add header to indicate collections were updated
    response.headers.set('X-Collections-Updated', 'true')
    
    return response
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a collection
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

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
      include: {
        other_Collection: true, // children relationship
        CollectionProduct: true // products relationship
      }
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if collection has children
    if (existingCollection.other_Collection.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete collection with sub-collections. Please delete sub-collections first.' 
      }, { status: 400 })
    }

    // Delete the collection (products will be automatically removed due to cascade)
    await prisma.collection.delete({
      where: { id }
    })

    // Trigger real-time update event for collections
    const response = NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    })
    
    // Add header to indicate collections were updated
    response.headers.set('X-Collections-Updated', 'true')
    
    return response
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

