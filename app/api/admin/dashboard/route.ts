import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// In-memory cache for admin dashboard data
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30 * 1000 // 30 seconds

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check cache first
    const cacheKey = 'admin-dashboard'
    const cached = cache.get(cacheKey)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      })
    }

    // Fetch all dashboard data in parallel
    const [
      stats,
      recentOrders,
      topProducts
    ] = await Promise.all([
      getDashboardStats(),
      getRecentOrders(),
      getTopProducts()
    ])

    const dashboardData = {
      stats,
      recentOrders,
      topProducts
    }

    // Cache the result
    cache.set(cacheKey, {
      data: dashboardData,
      timestamp: now
    })

    return NextResponse.json({
      success: true,
      data: dashboardData,
      cached: false
    })

  } catch (error) {
    console.error('Admin dashboard fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getDashboardStats() {
  const [
    totalOrders,
    totalProducts,
    totalCustomers,
    totalRevenue
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'completed' }
    })
  ])

  return {
    totalOrders,
    totalProducts,
    totalCustomers,
    totalRevenue: totalRevenue._sum.total || 0
  }
}

async function getRecentOrders() {
  const orders = await prisma.order.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      OrderItem: {
        include: {
          Product: {
            select: {
              name: true,
              price: true
            }
          }
        }
      }
    }
  })

  return orders.map(order => ({
    id: order.id,
    customer: order.User?.name || 'Unknown Customer',
    product: order.OrderItem.length > 0 ? order.OrderItem[0].Product.name : 'Multiple Items',
    amount: `৳${order.total.toLocaleString()}`,
    status: order.status,
    date: order.createdAt.toLocaleDateString()
  }))
}

async function getTopProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      Category: {
        select: {
          name: true
        }
      }
    }
  })

  return products.map(product => {
    // Handle images - could be JSON string or array
    let firstImage = '/api/placeholder/60/60'
    try {
      if (Array.isArray(product.images)) {
        firstImage = product.images[0] || '/api/placeholder/60/60'
      } else if (typeof product.images === 'string') {
        const imageArray = JSON.parse(product.images || '[]')
        firstImage = imageArray[0] || '/api/placeholder/60/60'
      }
    } catch {
      firstImage = '/api/placeholder/60/60'
    }

    return {
      name: product.name,
      sales: 0, // Default sales count since Product model doesn't have salesCount field
      revenue: `৳0`, // Default revenue since we don't have sales data
      image: firstImage
    }
  })
}
