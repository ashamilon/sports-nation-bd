import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { paymentService } from '@/lib/payment-service'
import { prisma } from '@/lib/db'
import { paymentStatus } from '@/lib/payment-config'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, gateway, transactionId, amount, currency } = body

    if (!orderId || !gateway) {
      return NextResponse.json({ error: 'Order ID and gateway are required' }, { status: 400 })
    }

    // Get order and payment from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: { include: { product: true } } }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Verify payment with gateway
    const isValid = await paymentService.validatePayment(
      gateway,
      transactionId || orderId,
      amount || order.totalAmount,
      currency || order.currency
    )

    if (isValid) {
      // Update payment status
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: {
            status: paymentStatus.COMPLETED,
            transactionId: transactionId || order.payment.transactionId,
            completedAt: new Date()
          }
        })
      }

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'confirmed' }
      })

      // Update product stock
      for (const item of order.items) {
        if (item.product.stock >= item.quantity) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order.id,
          status: 'confirmed',
          totalAmount: order.totalAmount,
          currency: order.currency
        }
      })
    } else {
      // Update payment status to failed
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { status: paymentStatus.FAILED }
        })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'failed' }
      })

      return NextResponse.json({
        success: false,
        message: 'Payment verification failed'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
