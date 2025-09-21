import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, visitorId, userId, behavior, productId, productName, value, metadata } = await request.json()

    if (!sessionId || !behavior) {
      return NextResponse.json(
        { error: 'Session ID and behavior are required' },
        { status: 400 }
      )
    }

    // Validate behavior type
    const validBehaviors = ['cart_add', 'checkout', 'payment_success']
    if (!validBehaviors.includes(behavior)) {
      return NextResponse.json(
        { error: 'Invalid behavior type' },
        { status: 400 }
      )
    }

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Create or update behavior record
    const behaviorRecord = await prisma.customerBehavior.upsert({
      where: {
        sessionId_behavior: {
          sessionId,
          behavior
        }
      },
      update: {
        productId,
        productName,
        value,
        metadata,
        expiresAt,
        updatedAt: new Date()
      },
      create: {
        sessionId,
        visitorId: visitorId || null,
        userId: userId || null,
        behavior,
        productId: productId || null,
        productName: productName || null,
        value: value || null,
        metadata: metadata || null,
        expiresAt
      }
    })

    return NextResponse.json({
      success: true,
      behavior: behaviorRecord
    })

  } catch (error) {
    console.error('Error tracking customer behavior:', error)
    return NextResponse.json(
      { error: 'Failed to track customer behavior' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Clean up expired behaviors
    await prisma.customerBehavior.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    const where = active ? { isActive: true } : {}

    // Get behavior statistics
    const [behaviors, stats] = await Promise.all([
      prisma.customerBehavior.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          Visitor: {
            select: {
              country: true,
              city: true,
              userAgent: true
            }
          },
          User: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.customerBehavior.groupBy({
        by: ['behavior'],
        where: {
          isActive: true,
          expiresAt: {
            gt: new Date()
          }
        },
        _count: {
          behavior: true
        }
      })
    ])

    // Format statistics
    const behaviorStats = {
      cart_add: 0,
      checkout: 0,
      payment_success: 0
    }

    stats.forEach(stat => {
      behaviorStats[stat.behavior as keyof typeof behaviorStats] = stat._count.behavior
    })

    return NextResponse.json({
      success: true,
      behaviors,
      stats: behaviorStats,
      total: behaviors.length
    })

  } catch (error) {
    console.error('Error fetching customer behavior:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer behavior' },
      { status: 500 }
    )
  }
}
