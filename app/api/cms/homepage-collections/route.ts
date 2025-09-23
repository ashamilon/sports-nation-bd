import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch homepage collection settings
export async function GET(request: NextRequest) {
  try {
    console.log('Homepage collections API called')
    
    // Fetch all collections (both active and inactive for admin management)
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: {
            CollectionProduct: true
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    console.log('Found collections:', collections.length)

    // Try to fetch existing homepage collection settings
    let settings = []
    try {
      settings = await prisma.homepageCollectionSettings.findMany({
        include: {
          Collection: {
            include: {
              _count: {
                select: {
                  CollectionProduct: true
                }
              }
            }
          }
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })
      console.log('Found settings:', settings.length)
    } catch (settingsError) {
      console.log('Settings table might not exist yet, using empty array:', settingsError)
      settings = []
    }

    return NextResponse.json({
      success: true,
      data: {
        collections,
        settings
      }
    })
  } catch (error) {
    console.error('Error fetching homepage collections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update homepage collection settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { collectionIds, isVisible = true } = body

    if (!Array.isArray(collectionIds)) {
      return NextResponse.json({ error: 'Collection IDs must be an array' }, { status: 400 })
    }

    // Validate that all collection IDs exist
    if (collectionIds.length > 0) {
      const existingCollections = await prisma.collection.findMany({
        where: {
          id: {
            in: collectionIds
          }
        },
        select: {
          id: true
        }
      })
      
      const existingIds = existingCollections.map(c => c.id)
      const invalidIds = collectionIds.filter(id => !existingIds.includes(id))
      
      if (invalidIds.length > 0) {
        console.error('Invalid collection IDs:', invalidIds)
        return NextResponse.json({ 
          error: 'Some collection IDs are invalid',
          invalidIds 
        }, { status: 400 })
      }
    }

    // Clear existing settings (with error handling)
    try {
      await prisma.homepageCollectionSettings.deleteMany({})
    } catch (deleteError) {
      console.log('No existing settings to delete or table does not exist yet:', deleteError)
    }

    // Create new settings
    if (collectionIds.length > 0) {
      const settings = await Promise.all(
        collectionIds.map((collectionId: string, index: number) =>
          prisma.homepageCollectionSettings.create({
            data: {
              collectionId,
              isVisible,
              sortOrder: index + 1
            }
          })
        )
      )

      return NextResponse.json({
        success: true,
        data: settings
      })
    }

    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    console.error('Error updating homepage collections:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
