import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch navigation items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}
    if (active === 'true') {
      where.isActive = true
    }

    const navigation = await prisma.navigation.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Filter out children that are inactive if active=true
    const filteredNavigation = active === 'true' 
      ? navigation.map(item => ({
          ...item,
          children: item.children.filter(child => child.isActive)
        }))
      : navigation

    return NextResponse.json({
      success: true,
      data: filteredNavigation
    })
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation' },
      { status: 500 }
    )
  }
}

// POST - Create navigation item
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
    const {
      title,
      url,
      parentId,
      order,
      isActive,
      isExternal,
      target,
      icon,
      metadata
    } = body

    const navigation = await prisma.navigation.create({
      data: {
        title,
        url,
        parentId,
        order: order || 0,
        isActive: isActive !== false,
        isExternal: isExternal || false,
        target: target || '_self',
        icon,
        metadata: metadata ? JSON.stringify(metadata) : null
      },
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: navigation
    })
  } catch (error) {
    console.error('Error creating navigation item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create navigation item' },
      { status: 500 }
    )
  }
}
