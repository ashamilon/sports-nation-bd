import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
        include: {
          OrderItem: {
            include: {
              Product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              }
            }
          },
          Payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentMethod: true,
              transactionId: true,
              metadata: true,
              createdAt: true
            }
          }
        },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tipAmount: order.tipAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        OrderItem: order.OrderItem,
        Payment: order.Payment || []
      }))
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch orders' 
    }, { status: 500 })
  }
}
