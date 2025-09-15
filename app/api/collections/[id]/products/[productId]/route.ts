import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT - Update a product in a collection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, productId } = await params
    const body = await request.json()
    const { sortOrder, isFeatured } = body

    // Check if collection product exists
    const existingCollectionProduct = await prisma.collectionProduct.findUnique({
      where: {
        collectionId_productId: {
          collectionId: id,
          productId: productId
        }
      }
    })

    if (!existingCollectionProduct) {
      return NextResponse.json({ error: 'Product not found in collection' }, { status: 404 })
    }

    const collectionProduct = await prisma.collectionProduct.update({
      where: {
        collectionId_productId: {
          collectionId: id,
          productId: productId
        }
      },
      data: {
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isFeatured !== undefined && { isFeatured })
      },
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
    })

    return NextResponse.json({
      success: true,
      data: collectionProduct
    })
  } catch (error) {
    console.error('Error updating collection product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove a product from a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, productId } = await params

    // Check if collection product exists
    const existingCollectionProduct = await prisma.collectionProduct.findUnique({
      where: {
        collectionId_productId: {
          collectionId: id,
          productId: productId
        }
      }
    })

    if (!existingCollectionProduct) {
      return NextResponse.json({ error: 'Product not found in collection' }, { status: 404 })
    }

    await prisma.collectionProduct.delete({
      where: {
        collectionId_productId: {
          collectionId: id,
          productId: productId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product removed from collection successfully'
    })
  } catch (error) {
    console.error('Error removing product from collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

