import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update courier information for an order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: orderId } = await params
    const body = await request.json()
    const { courierService, courierTrackingId, trackingNumber } = body

    if (!courierService || !courierTrackingId) {
      return NextResponse.json({ 
        error: 'Courier service and tracking ID are required' 
      }, { status: 400 })
    }

    // Validate courier service
    const validServices = ['sundarban', 'pathao']
    if (!validServices.includes(courierService)) {
      return NextResponse.json({ 
        error: 'Invalid courier service. Must be sundarban or pathao' 
      }, { status: 400 })
    }

    // Update order with courier information
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierService,
        courierTrackingId,
        trackingNumber: trackingNumber || courierTrackingId,
        status: 'shipped' // Update status to shipped when courier is assigned
      },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        trackingUpdates: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    // Create initial tracking update
    await prisma.trackingUpdate.create({
      data: {
        orderId,
        status: 'picked_up',
        location: 'Warehouse',
        description: `Package picked up by ${courierService} courier service`,
        courierData: JSON.stringify({
          service: courierService,
          trackingId: courierTrackingId,
          assignedAt: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({ 
      order: updatedOrder,
      message: 'Courier information updated successfully' 
    })
  } catch (error) {
    console.error('Courier update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get courier information for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: orderId } = await params

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        courierService: true,
        courierTrackingId: true,
        trackingNumber: true,
        status: true,
        shippingAddress: true,
        trackingUpdates: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get real-time tracking if available
    let courierTracking = null
    if (order.courierService && order.courierTrackingId) {
      courierTracking = await getCourierTracking(order.courierService, order.courierTrackingId)
    }

    return NextResponse.json({
      order,
      courierTracking
    })
  } catch (error) {
    console.error('Get courier info error:', error)
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
    // Mock data for now - replace with actual Sundarban API
    return {
      service: 'sundarban',
      trackingId,
      status: 'in_transit',
      location: 'Dhaka Hub',
      updates: [
        {
          status: 'picked_up',
          location: 'Warehouse',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Package picked up from warehouse'
        },
        {
          status: 'in_transit',
          location: 'Dhaka Hub',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Package in transit to destination'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString()
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
    // Mock data for now - replace with actual Pathao API
    return {
      service: 'pathao',
      trackingId,
      status: 'out_for_delivery',
      location: 'Local Hub',
      updates: [
        {
          status: 'picked_up',
          location: 'Warehouse',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Package picked up from warehouse'
        },
        {
          status: 'in_transit',
          location: 'Local Hub',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          description: 'Package arrived at local hub'
        },
        {
          status: 'out_for_delivery',
          location: 'Local Hub',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          description: 'Package out for delivery'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString()
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
