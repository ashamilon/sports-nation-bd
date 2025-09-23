import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SMSService } from '@/lib/sms-service'

// Pathao webhook handler for order status updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate webhook data
    const { 
      order_id, 
      tracking_code, 
      status, 
      status_description,
      current_location,
      estimated_delivery_time,
      timestamp 
    } = body

    if (!order_id || !tracking_code || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find order by Pathao tracking code
    const order = await prisma.order.findFirst({
      where: { 
        courierTrackingId: tracking_code,
        courierService: 'pathao'
      },
      include: {
        User: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      console.error('Order not found for tracking code:', tracking_code)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    let orderStatus = order.status
    switch (status.toLowerCase()) {
      case 'pending':
        orderStatus = 'processing'
        break
      case 'picked_up':
      case 'in_transit':
        orderStatus = 'shipped'
        break
      case 'out_for_delivery':
        orderStatus = 'out_for_delivery'
        break
      case 'delivered':
        orderStatus = 'completed'
        break
      case 'cancelled':
      case 'failed':
        orderStatus = 'cancelled'
        break
    }

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
      }
    })

    // Create tracking update
    await prisma.trackingUpdate.create({
      data: {
        id: crypto.randomUUID(),
        orderId: order.id,
        status: orderStatus,
        location: current_location || 'Unknown',
        description: status_description || `Order ${status}`,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        updatedAt: new Date()
      }
    })

    // Send SMS notification to customer
    if (order.User?.phone && ['delivered', 'out_for_delivery', 'cancelled'].includes(status.toLowerCase())) {
      try {
        const smsService = new SMSService()
        let message = ''
        
        switch (status.toLowerCase()) {
          case 'delivered':
            message = `Your order ${order.orderNumber} has been delivered successfully. Thank you for choosing Sports Nation BD!`
            break
          case 'out_for_delivery':
            message = `Your order ${order.orderNumber} is out for delivery. Expected delivery time: ${estimated_delivery_time || 'Today'}.`
            break
          case 'cancelled':
            message = `Your order ${order.orderNumber} has been cancelled. Please contact customer support for assistance.`
            break
        }

        if (message) {
          // TODO: Implement generic SMS sending method
          console.log('SMS would be sent to:', order.User.phone, 'Message:', message)
        }
      } catch (smsError) {
        console.error('Error sending SMS notification:', smsError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      orderId: order.id,
      status: orderStatus
    })

  } catch (error) {
    console.error('Pathao webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET method for webhook verification (if required by Pathao)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({ 
    message: 'Pathao webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
