import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent orders (last 24 hours)
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        User: {
          select: { name: true }
        }
      }
    })

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5
        }
      },
      take: 3,
      select: { name: true, stock: true }
    })

    // Get recent reviews (last 24 hours)
    const recentReviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        isApproved: true
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        User: {
          select: { name: true }
        },
        Product: {
          select: { name: true }
        }
      }
    })

    // Format notifications
    const notifications: any[] = []

    // Add order notifications
    recentOrders.forEach(order => {
      notifications.push({
        id: `order_${order.id}`,
        title: 'New Order Received',
        message: `Order #${order.id.slice(-6)} from ${order.User?.name || 'Customer'}`,
        time: getTimeAgo(order.createdAt),
        type: 'order'
      })
    })

    // Add low stock notifications
    lowStockProducts.forEach(product => {
      notifications.push({
        id: `stock_${product.name}`,
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.stock} left)`,
        time: 'Just now',
        type: 'stock'
      })
    })

    // Add review notifications
    recentReviews.forEach(review => {
      notifications.push({
        id: `review_${review.id}`,
        title: 'New Review',
        message: `${review.rating}-star review for ${review.Product?.name}`,
        time: getTimeAgo(review.createdAt),
        type: 'review'
      })
    })

    // Sort by time (most recent first)
    notifications.sort((a, b) => {
      if (a.time === 'Just now') return -1
      if (b.time === 'Just now') return 1
      return 0
    })

    return NextResponse.json({
      notifications: notifications.slice(0, 10) // Limit to 10 notifications
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} min ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}
