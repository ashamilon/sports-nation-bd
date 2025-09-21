import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { pathaoCourier, PathaoOrderRequest } from '@/lib/courier/pathao'

// Create Pathao courier order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, courierData } = body

    if (!orderId || !courierData) {
      return NextResponse.json(
        { error: 'Order ID and courier data are required' },
        { status: 400 }
      )
    }

    // Get order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        User: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        OrderItem: {
          include: {
            Product: {
              select: {
                name: true,
                price: true,
                weight: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Parse shipping address
    const shippingAddress = JSON.parse(order.shippingAddress || '{}')
    
    // Calculate total weight and prepare item description
    const totalWeight = order.OrderItem.reduce((sum, item) => {
      return sum + (item.Product.weight || 0.5) * item.quantity
    }, 0)

    const itemDescription = order.OrderItem.map(item => 
      `${item.Product.name} (Qty: ${item.quantity})`
    ).join(', ')

    // Get location names from IDs
    let recipientCity = 'Dhaka'
    let recipientZone = 'Dhanmondi'
    let recipientArea = ''

    try {
      // Fetch location names from Pathao API
      const { pathaoCourier } = await import('@/lib/courier/pathao')
      
      if (courierData.cityId) {
        const cities = await pathaoCourier.getCities()
        const city = cities.find(c => c.city_id === courierData.cityId)
        if (city) {
          recipientCity = city.city_name
        }
      }
      
      if (courierData.zoneId && courierData.cityId) {
        const zones = await pathaoCourier.getZones(courierData.cityId)
        const zone = zones.find(z => z.zone_id === courierData.zoneId)
        if (zone) {
          recipientZone = zone.zone_name
        }
      }
      
      if (courierData.areaId && courierData.zoneId) {
        const areas = await pathaoCourier.getAreas(courierData.zoneId)
        const area = areas.find(a => a.area_id === courierData.areaId)
        if (area) {
          recipientArea = area.area_name
        }
      }
    } catch (error) {
      console.error('Error fetching location names:', error)
    }

    // Prepare Pathao order request
    const pathaoOrderRequest: PathaoOrderRequest = {
      merchant_order_id: order.orderNumber,
      recipient_name: shippingAddress.name || order.User?.name || 'Customer',
      recipient_phone: shippingAddress.phone || order.User?.phone || 'N/A',
      recipient_address: `${shippingAddress.address || 'N/A'}${recipientArea ? `, ${recipientArea}` : ''}`,
      recipient_city: recipientCity,
      recipient_zone: recipientZone,
      delivery_type: courierData.deliveryType || '48',
      item_type: 'Parcel',
      item_quantity: order.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
      item_weight: Math.max(totalWeight, 0.5), // Minimum 0.5kg
      item_description: itemDescription,
      item_price: order.total,
      item_category: 'Sports & Recreation',
      special_instruction: courierData.specialInstruction || '',
      item_sku: order.orderNumber,
      pickup_address: process.env.PATHAO_PICKUP_ADDRESS || 'Sports Nation BD Warehouse',
      pickup_city: process.env.PATHAO_PICKUP_CITY || 'Dhaka',
      pickup_zone: process.env.PATHAO_PICKUP_ZONE || 'Dhanmondi'
    }

    // Create order with Pathao
    const pathaoResponse = await pathaoCourier.createOrder(pathaoOrderRequest)

    if (!pathaoResponse.success) {
      return NextResponse.json(
        { 
          error: 'Failed to create Pathao order',
          details: pathaoResponse.message 
        },
        { status: 400 }
      )
    }

    // Update order in database with Pathao tracking info
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierService: 'pathao',
        courierTrackingId: pathaoResponse.data?.tracking_code || '',
        trackingNumber: pathaoResponse.data?.tracking_code || '',
        status: 'shipped',
        courierOrderId: pathaoResponse.data?.order_id?.toString() || '',
        courierInvoiceId: pathaoResponse.data?.invoice_id?.toString() || ''
      },
      include: {
        User: {
          select: { name: true, email: true, phone: true }
        }
      }
    })

    // Create tracking update
    await prisma.trackingUpdate.create({
      data: {
        orderId: orderId,
        status: 'shipped',
        location: 'Warehouse',
        description: 'Order shipped via Pathao courier',
        timestamp: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Pathao order created successfully',
      data: {
        order: updatedOrder,
        pathaoResponse: pathaoResponse.data
      }
    })

  } catch (error) {
    console.error('Pathao order creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get Pathao order status
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
    const orderId = searchParams.get('orderId')
    const trackingId = searchParams.get('trackingId')

    if (!orderId && !trackingId) {
      return NextResponse.json(
        { error: 'Order ID or tracking ID is required' },
        { status: 400 }
      )
    }

    let pathaoOrderId = orderId

    // If tracking ID is provided, get order from database first
    if (trackingId && !orderId) {
      const order = await prisma.order.findFirst({
        where: { courierTrackingId: trackingId },
        select: { courierOrderId: true }
      })
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found for tracking ID' },
          { status: 404 }
        )
      }
      
      pathaoOrderId = order.courierOrderId
    }

    if (!pathaoOrderId) {
      return NextResponse.json(
        { error: 'Pathao order ID not found' },
        { status: 404 }
      )
    }

    // Get status from Pathao
    const statusResponse = await pathaoCourier.getOrderStatus(pathaoOrderId)

    return NextResponse.json({
      success: true,
      data: statusResponse
    })

  } catch (error) {
    console.error('Pathao status check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get order status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
