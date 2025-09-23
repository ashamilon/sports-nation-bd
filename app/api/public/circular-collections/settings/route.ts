import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch carousel settings (public access)
export async function GET() {
  try {
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
    // Return default settings on error
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
}
