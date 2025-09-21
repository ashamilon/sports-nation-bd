import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Cache dashboard data for 30 seconds to improve performance
const CACHE_DURATION = 30 * 1000 // 30 seconds
const cache = new Map<string, { data: any; timestamp: number }>()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check cache first
    const cacheKey = `dashboard-${session.user.id}`
    const cached = cache.get(cacheKey)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cached.data)
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        loyaltyLevel: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all dashboard data in parallel
    const [orderStats, recentOrders] = await Promise.all([
      // Get order statistics
      prisma.order.aggregate({
        where: { userId: user.id },
        _count: { id: true },
        _sum: { total: true }
      }).catch(() => ({ _count: { id: 0 }, _sum: { total: 0 } })),
      
      // Get recent orders (limit to 5 for performance)
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          OrderItem: {
            select: {
              id: true,
              quantity: true,
              Product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }).catch(() => [])
    ])

    const totalOrders = orderStats._count.id || 0
    const totalSpent = orderStats._sum.total || 0

    // Calculate loyalty data
    const currentLevel = user.loyaltyLevel || 'bronze'
    const loyaltyLevels = {
      bronze: { name: 'Bronze', icon: '🥉', color: '#CD7F32', discount: 50, nextLevel: 'Silver', nextLevelOrders: 10 },
      silver: { name: 'Silver', icon: '🥈', color: '#C0C0C0', discount: 150, nextLevel: 'Gold', nextLevelOrders: 30 },
      gold: { name: 'Gold', icon: '🥇', color: '#FFD700', discount: 220, nextLevel: 'Platinum', nextLevelOrders: 50 },
      platinum: { name: 'Platinum', icon: '💎', color: '#E5E4E2', discount: 400, nextLevel: null, nextLevelOrders: null }
    }

    const currentConfig = loyaltyLevels[currentLevel as keyof typeof loyaltyLevels]
    const nextConfig = currentConfig.nextLevel ? loyaltyLevels[currentConfig.nextLevel.toLowerCase() as keyof typeof loyaltyLevels] : null

    // Format recent orders for display
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      itemCount: order.OrderItem.length,
      items: order.OrderItem.map(item => ({
        name: item.Product.name,
        quantity: item.quantity
      }))
    }))

    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        loyaltyLevel: user.loyaltyLevel
      },
      stats: {
        totalOrders,
        totalSpent,
        totalReviews: 0, // TODO: Implement reviews
        wishlistCount: 0 // TODO: Implement wishlist
      },
      recentOrders: formattedRecentOrders,
      loyalty: {
        currentLevel,
        currentConfig,
        nextConfig,
        totalOrders,
        totalSpent,
        progress: nextConfig ? (totalOrders / currentConfig.nextLevelOrders!) * 100 : 100
      }
    }

    // Cache the result
    cache.set(cacheKey, { data: dashboardData, timestamp: now })

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
