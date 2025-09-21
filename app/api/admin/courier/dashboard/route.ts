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

    // Get all orders with courier information
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { courierService: 'pathao' },
          { courierService: 'sundarban' }
        ]
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
    const pathaoOrders = orders.filter(order => order.courierService === 'pathao').length
    const sundarbanOrders = orders.filter(order => order.courierService === 'sundarban').length
    
    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const deliveredToday = orders.filter(order => 
      order.status === 'delivered' && 
      order.updatedAt >= today && 
      order.updatedAt < tomorrow
    ).length

    const inTransit = orders.filter(order => 
      ['shipped', 'in_transit', 'out_for_delivery'].includes(order.status)
    ).length

    const pending = orders.filter(order => 
      ['pending', 'processing'].includes(order.status)
    ).length

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
        courierService: order.courierService || 'unknown',
        courierTrackingId: order.courierTrackingId || '',
        status: order.status,
        customerName: order.User?.name || 'Unknown',
        customerPhone: order.User?.phone || 'N/A',
        deliveryAddress: shippingAddress,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
        estimatedDelivery: order.estimatedDelivery?.toISOString(),
        lastUpdate: order.updatedAt.toISOString()
      }
    })

    const stats = {
      totalOrders,
      pathaoOrders,
      sundarbanOrders,
      deliveredToday,
      inTransit,
      pending
    }

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      stats
    })

  } catch (error) {
    console.error('Courier dashboard error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
