import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const active = searchParams.get('active') !== 'false'

    const where: any = {}
    if (position) where.position = position
    if (active) {
      where.isActive = true
      // Temporarily removed startsAt and expiresAt filters until database schema is updated
    } else if (active === false) {
      // When explicitly requesting inactive items, show all (for admin)
      // No additional filters
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    const response = NextResponse.json({ success: true, data: banners })
    
    // Add caching headers for better performance (only for public requests)
    if (active !== false) {
      response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600') // 10 minutes cache
      response.headers.set('Vary', 'Accept-Encoding')
    } else {
      // Disable caching for admin requests (when active=false)
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    
    return response
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create banner
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, image, link, position, priority, isActive, metadata } = body

    if (!title || !image || !position) {
      return NextResponse.json({ error: 'Title, image, and position are required' }, { status: 400 })
    }

    const banner = await prisma.banner.create({
      data: {
        id: `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        image,
        link,
        position,
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
        metadata: metadata ? JSON.stringify(metadata) : null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
