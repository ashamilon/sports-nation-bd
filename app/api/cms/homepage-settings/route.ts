import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all homepage settings
export async function GET() {
  try {
    const settings = await prisma.homepageSettings.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Error fetching homepage settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage settings' },
      { status: 500 }
    )
  }
}

// POST - Create new homepage setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sectionKey, sectionName, isVisible, sortOrder, metadata } = body

    if (!sectionKey || !sectionName) {
      return NextResponse.json(
        { success: false, error: 'Section key and name are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.homepageSettings.create({
      data: {
        sectionKey,
        sectionName,
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ?? 0,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json({
      success: true,
      data: setting
    })
  } catch (error) {
    console.error('Error creating homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create homepage setting' },
      { status: 500 }
    )
  }
}

