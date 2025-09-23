import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch carousel settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get settings from SiteContent table
    const settings = await prisma.siteContent.findFirst({
      where: {
        key: 'circular_collections_carousel_settings'
      }
    })

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        isEnabled: true,
        maxItems: 6,
        autoRotate: true,
        rotationSpeed: 20
      }
      return NextResponse.json({
        success: true,
        data: defaultSettings
      })
    }

    const parsedSettings = JSON.parse(settings.content)
    return NextResponse.json({
      success: true,
      data: parsedSettings
    })
  } catch (error) {
    console.error('Error fetching carousel settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update carousel settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isEnabled, maxItems, autoRotate, rotationSpeed } = body

    // Validate input
    if (typeof isEnabled !== 'boolean' || 
        typeof maxItems !== 'number' || 
        typeof autoRotate !== 'boolean' || 
        typeof rotationSpeed !== 'number') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    if (maxItems < 3 || maxItems > 12) {
      return NextResponse.json({ error: 'Max items must be between 3 and 12' }, { status: 400 })
    }

    if (rotationSpeed < 5 || rotationSpeed > 60) {
      return NextResponse.json({ error: 'Rotation speed must be between 5 and 60 seconds' }, { status: 400 })
    }

    const settingsData = {
      isEnabled,
      maxItems,
      autoRotate,
      rotationSpeed
    }

    // Upsert settings in SiteContent table
    const settings = await prisma.siteContent.upsert({
      where: {
        key: 'circular_collections_carousel_settings'
      },
      update: {
        content: JSON.stringify(settingsData),
        updatedAt: new Date()
      },
      create: {
        id: crypto.randomUUID(),
        key: 'circular_collections_carousel_settings',
        title: 'Circular Collections Carousel Settings',
        content: JSON.stringify(settingsData),
        type: 'json',
        category: 'carousel',
        isActive: true,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: settingsData
    })
  } catch (error) {
    console.error('Error updating carousel settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
