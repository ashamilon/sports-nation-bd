import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get Pathao orders within date range
    const orders = await prisma.order.findMany({
      where: {
        courierService: 'pathao',
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        User: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalOrders = orders.length
    const deliveredToday = orders.filter(order => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return order.status === 'completed' && 
             order.updatedAt >= today
    }).length

    const inTransit = orders.filter(order => 
      ['shipped', 'in_transit', 'out_for_delivery'].includes(order.status)
    ).length

    const pending = orders.filter(order => 
      ['pending', 'processing'].includes(order.status)
    ).length

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Calculate average delivery time (mock calculation)
    const completedOrders = orders.filter(order => order.status === 'completed')
    const averageDeliveryTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => {
          const deliveryTime = order.updatedAt.getTime() - order.createdAt.getTime()
          return sum + (deliveryTime / (1000 * 60 * 60)) // Convert to hours
        }, 0) / completedOrders.length
      : 0

    // Calculate success rate
    const successRate = totalOrders > 0 
      ? (completedOrders.length / totalOrders) * 100 
      : 0

    // Generate daily orders data
    const dailyOrders = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayOrders = orders.filter(order => 
        order.createdAt >= date && order.createdAt < nextDate
      )
      
      dailyOrders.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      })
    }

    // Status distribution
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0
    }))

    // Top delivery areas (mock data - would need to parse addresses)
    const topDeliveryAreas = [
      { area: 'Dhanmondi', orders: Math.floor(totalOrders * 0.3) },
      { area: 'Gulshan', orders: Math.floor(totalOrders * 0.25) },
      { area: 'Uttara', orders: Math.floor(totalOrders * 0.2) },
      { area: 'Banani', orders: Math.floor(totalOrders * 0.15) },
      { area: 'Others', orders: Math.floor(totalOrders * 0.1) }
    ]

    // Transform orders data
    const transformedOrders = orders.map(order => {
      let shippingAddress = 'N/A'
      try {
        const address = JSON.parse(order.shippingAddress || '{}')
        shippingAddress = `${address.address || ''}, ${address.city || ''}, ${address.country || ''}`.trim()
      } catch (error) {
        console.error('Error parsing shipping address:', error)
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        courierTrackingId: order.courierTrackingId || '',
        status: order.status,
        customerName: order.User?.name || 'Unknown',
        customerPhone: order.User?.phone || 'N/A',
        deliveryAddress: shippingAddress,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
        lastUpdate: order.updatedAt.toISOString(),
        deliveryCost: 60 // Default Pathao delivery cost
      }
    })

    const stats = {
      totalOrders,
      deliveredToday,
      inTransit,
      pending,
      totalRevenue,
      averageDeliveryTime,
      successRate
    }

    const analytics = {
      dailyOrders,
      statusDistribution,
      topDeliveryAreas
    }

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      stats,
      analytics
    })

  } catch (error) {
    console.error('Pathao dashboard error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
