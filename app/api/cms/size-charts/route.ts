import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch size charts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fabricType = searchParams.get('fabricType')
    const active = searchParams.get('active') !== 'false'

    const where: any = {}
    if (fabricType) {
      // Filter by fabricType in metadata
      where.metadata = {
        contains: `"fabricType":"${fabricType}"`
      }
    }
    if (active) {
      where.isActive = true
    } else if (active === false) {
      // When explicitly requesting inactive items, show all (for admin)
    }

    const sizeCharts = await prisma.siteContent.findMany({
      where: {
        category: 'size_chart',
        ...where
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    const response = NextResponse.json({ success: true, data: sizeCharts })
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600') // 10 minutes cache
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  } catch (error) {
    console.error('Error fetching size charts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create size chart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fabricType, title, content, isActive, metadata } = body

    if (!fabricType || !content) {
      return NextResponse.json({ error: 'Fabric type and content are required' }, { status: 400 })
    }

    const sizeChart = await prisma.siteContent.create({
      data: {
        id: `size_chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key: `size_chart_${fabricType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title || `${fabricType} Size Chart`,
        content,
        type: 'size_chart',
        category: 'size_chart',
        isActive: isActive !== undefined ? isActive : true,
        metadata: metadata ? JSON.stringify(metadata) : JSON.stringify({ fabricType }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, data: sizeChart })
  } catch (error) {
    console.error('Error creating size chart:', error)
    
    // Handle specific Prisma errors
    if ((error as any)?.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A size chart for this fabric type already exists. Please use a different fabric type or update the existing one.' 
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to create size chart. Please try again.' 
    }, { status: 500 })
  }
}
