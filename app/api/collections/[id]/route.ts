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
        parent: true,
        children: includeChildren ? {
          include: {
            products: includeProducts ? {
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
        products: includeProducts ? {
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
            children: true,
            products: true
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
        children: true,
        products: true
      }
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if collection has children
    if (existingCollection.children.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete collection with sub-collections. Please delete sub-collections first.' 
      }, { status: 400 })
    }

    // Delete the collection (products will be automatically removed due to cascade)
    await prisma.collection.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

