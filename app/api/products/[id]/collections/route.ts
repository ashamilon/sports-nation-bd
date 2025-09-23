import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = id

    // Fetch product with its collections
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        CollectionProduct: {
          include: {
            Collection: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                isActive: true,
                isFeatured: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const collections = product.CollectionProduct.map(cp => cp.Collection)

    return NextResponse.json({
      success: true,
      collections
    })
  } catch (error) {
    console.error('Error fetching product collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product collections' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = id
    const { collectionIds } = await request.json()

    if (!Array.isArray(collectionIds)) {
      return NextResponse.json({ error: 'collectionIds must be an array' }, { status: 400 })
    }

    // Verify the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify all collections exist
    if (collectionIds.length > 0) {
      const collections = await prisma.collection.findMany({
        where: { id: { in: collectionIds } }
      })

      if (collections.length !== collectionIds.length) {
        return NextResponse.json({ error: 'One or more collections not found' }, { status: 404 })
      }
    }

    // Remove existing associations for this product
    await prisma.collectionProduct.deleteMany({
      where: { productId }
    })

    // Create new associations
    if (collectionIds.length > 0) {
      await prisma.collectionProduct.createMany({
        data: collectionIds.map((collectionId: string) => ({
          productId,
          collectionId,
          updatedAt: new Date()
        }))
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Product collections updated successfully'
    })
  } catch (error) {
    console.error('Error updating product collections:', error)
    return NextResponse.json(
      { error: 'Failed to update product collections' },
      { status: 500 }
    )
  }
}
