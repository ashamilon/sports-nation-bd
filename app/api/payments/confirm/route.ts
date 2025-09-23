import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      paymentIntentId, 
      orderId, 
      paymentStatus,
      transactionId 
    } = await request.json()

    // Validate required fields
    if (!paymentIntentId || !orderId || !paymentStatus) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        User: true,
        OrderItem: {
          include: {
            Product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus === 'succeeded' ? 'paid' : 'failed',
        transactionId: transactionId || null,
        paymentIntentId,
        updatedAt: new Date()
      }
    })

    // If payment succeeded, update order status
    if (paymentStatus === 'succeeded') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'confirmed'
        }
      })

      // Update product stock
      for (const item of order.OrderItem) {
        if (item.productVariantId) {
          await prisma.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        }
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        currency: 'BDT',
        status: paymentStatus === 'succeeded' ? 'completed' : 'failed',
        paymentMethod: order.paymentMethod || 'card',
        transactionId: transactionId || null,
        paymentIntentId,
        metadata: JSON.stringify({
          userId: session.user.id,
          orderItems: order.OrderItem.length,
          paymentStatus
        })
      }
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      payment,
      message: paymentStatus === 'succeeded' 
        ? 'Payment confirmed successfully' 
        : 'Payment failed'
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
