import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get tracking information for an order
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const trackingNumber = searchParams.get('trackingNumber')

    if (!orderId && !trackingNumber) {
      return NextResponse.json({ error: 'Order ID or tracking number required' }, { status: 400 })
    }

    let order
    if (orderId) {
      order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id
        },
        include: {
          trackingUpdates: {
            orderBy: { timestamp: 'desc' }
          },
          user: {
            select: { name: true, email: true, phone: true }
          }
        }
      })
    } else if (trackingNumber) {
      order = await prisma.order.findFirst({
        where: {
          trackingNumber: trackingNumber,
          userId: session.user.id
        },
        include: {
          trackingUpdates: {
            orderBy: { timestamp: 'desc' }
          },
          user: {
            select: { name: true, email: true, phone: true }
          }
        }
      })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get real-time tracking from courier service
    let courierTracking = null
    if (order.courierService && order.courierTrackingId) {
      courierTracking = await getCourierTracking(order.courierService, order.courierTrackingId)
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        courierService: order.courierService,
        courierTrackingId: order.courierTrackingId,
        trackingNumber: order.trackingNumber,
        shippingAddress: JSON.parse(order.shippingAddress),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      trackingUpdates: order.trackingUpdates,
      courierTracking,
      user: order.user
    })
  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update tracking information (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, status, location, description, courierData } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 })
    }

    // Create tracking update
    const trackingUpdate = await prisma.trackingUpdate.create({
      data: {
        orderId,
        status,
        location,
        description,
        courierData: courierData ? JSON.stringify(courierData) : null
      }
    })

    // Update order status if needed
    const statusMapping: Record<string, string> = {
      'picked_up': 'processing',
      'in_transit': 'shipped',
      'out_for_delivery': 'shipped',
      'delivered': 'completed',
      'failed_delivery': 'shipped',
      'returned': 'cancelled'
    }

    if (statusMapping[status]) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: statusMapping[status] }
      })
    }

    return NextResponse.json({ trackingUpdate })
  } catch (error) {
    console.error('Tracking update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get courier tracking from external APIs
async function getCourierTracking(service: string, trackingId: string) {
  try {
    switch (service) {
      case 'sundarban':
        return await getSundarbanTracking(trackingId)
      case 'pathao':
        return await getPathaoTracking(trackingId)
      default:
        return null
    }
  } catch (error) {
    console.error(`Error fetching ${service} tracking:`, error)
    return null
  }
}

// Sundarban Courier tracking
async function getSundarbanTracking(trackingId: string) {
  try {
    // Sundarban API endpoint (you'll need to get the actual API details from Sundarban)
    const response = await fetch(`https://api.sundarbancourier.com/track/${trackingId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUNDARBAN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Sundarban API error')
    }

    const data = await response.json()
    return {
      service: 'sundarban',
      trackingId,
      status: data.status,
      location: data.currentLocation,
      updates: data.trackingHistory || [],
      estimatedDelivery: data.estimatedDelivery,
      lastUpdated: data.lastUpdated
    }
  } catch (error) {
    console.error('Sundarban tracking error:', error)
    return {
      service: 'sundarban',
      trackingId,
      error: 'Unable to fetch tracking information'
    }
  }
}

// Pathao tracking
async function getPathaoTracking(trackingId: string) {
  try {
    // Import Pathao courier service
    const { pathaoCourier } = await import('@/lib/courier/pathao')
    
    // Get order status from Pathao
    const statusResponse = await pathaoCourier.getOrderStatus(trackingId)
    
    if (!statusResponse || statusResponse.error) {
      throw new Error(statusResponse?.error || 'Failed to get tracking information')
    }

    // Transform Pathao response to our format
    return {
      service: 'pathao',
      trackingId,
      status: statusResponse.status || 'unknown',
      location: statusResponse.currentLocation || 'Unknown',
      updates: statusResponse.trackingHistory || [],
      estimatedDelivery: statusResponse.estimatedDelivery,
      lastUpdated: statusResponse.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Pathao tracking error:', error)
    return {
      service: 'pathao',
      trackingId,
      error: 'Unable to fetch tracking information'
    }
  }
}
