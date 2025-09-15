import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch countdown timers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const type = searchParams.get('type')
    const active = searchParams.get('active') !== 'false'

    const where: any = {}
    if (position) where.position = position
    if (type) where.type = type
    if (active) {
      where.isActive = true
      where.targetDate = { gte: new Date() } // Only future countdowns
    } else if (active === false) {
      // When explicitly requesting inactive items, show all (for admin)
      // No additional filters
    }

    const countdowns = await prisma.countdownTimer.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { targetDate: 'asc' }
      ]
    })

    return NextResponse.json({ success: true, data: countdowns })
  } catch (error) {
    console.error('Error fetching countdowns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create countdown timer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, endDate, type, targetId, isActive, position, priority, metadata } = body

    if (!title || !endDate) {
      return NextResponse.json({ error: 'Title and end date are required' }, { status: 400 })
    }

    const countdown = await prisma.countdownTimer.create({
      data: {
        title,
        description,
        targetDate: new Date(endDate),
        type: type || 'offer',
        targetId,
        isActive: isActive !== undefined ? isActive : true,
        position: position || 'home',
        priority: priority || 0,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json({ success: true, data: countdown })
  } catch (error) {
    console.error('Error creating countdown:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
