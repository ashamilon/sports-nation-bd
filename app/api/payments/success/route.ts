import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { smsService } from '@/lib/sms-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      orderId, 
      transactionId, 
      paymentStatus,
      customerInfo,
      items 
    } = body

    console.log('Payment success callback received:', { orderId, transactionId, paymentStatus })

    // Validate required fields
    if (!orderId || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, transactionId' },
        { status: 400 }
      )
    }

    // Find the order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: {
        items: {
          include: {
            product: true
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

    // Update order status to confirmed
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'confirmed',
        paymentStatus: 'paid',
        transactionId: transactionId,
        paymentIntentId: transactionId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update payment record
    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: {
        status: 'completed',
        transactionId: transactionId,
        paymentIntentId: transactionId
      }
    })

    // Parse customer info from shipping address
    let customerData
    try {
      customerData = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress
    } catch (error) {
      console.error('Error parsing customer info:', error)
      customerData = {}
    }

    // Send SMS confirmation if customer is in Bangladesh
    if (customerData.phone && customerData.country === 'BD') {
      try {
        const smsResult = await smsService.sendOrderConfirmation({
          phone: customerData.phone,
          orderNumber: order.orderNumber,
          customerName: customerData.name || 'Customer',
          totalAmount: order.total,
          deliveryAddress: customerData.address || 'Address not provided',
          items: order.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity
          }))
        })

        if (smsResult.success) {
          console.log('SMS sent successfully:', smsResult.messageId)
        } else {
          console.error('SMS sending failed:', smsResult.error)
        }
      } catch (smsError) {
        console.error('SMS service error:', smsError)
        // Don't fail the payment success callback if SMS fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order confirmed successfully',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus
      }
    })

  } catch (error) {
    console.error('Payment success callback error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for payment success page redirects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')
    const transactionId = searchParams.get('transaction_id')
    const status = searchParams.get('status')

    if (orderId && transactionId && status === 'success') {
      // Process the payment success
      const result = await POST(new NextRequest(request.url || 'http://localhost:3000', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          transactionId,
          paymentStatus: 'completed'
        })
      }))

      if (result.ok) {
        // Redirect to success page
        return NextResponse.redirect(new URL('/payment/success', request.url || 'http://localhost:3000'))
      }
    }

    // Default redirect to success page
    return NextResponse.redirect(new URL('/payment/success', request.url || 'http://localhost:3000'))

  } catch (error) {
    console.error('Payment success GET error:', error)
    return NextResponse.redirect(new URL('/payment/success', request.url || 'http://localhost:3000'))
  }
}
