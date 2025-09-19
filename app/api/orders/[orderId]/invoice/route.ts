import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    // Fetch order with all related data
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id // Ensure user can only access their own orders
      },
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
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate invoice data
    const invoiceData = {
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      customer: {
        name: order.User.name,
        email: order.User.email
      },
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      items: order.OrderItem.map(item => ({
        name: item.Product.name,
        quantity: item.quantity,
        unitPrice: item.price / item.quantity,
        totalPrice: item.price,
        customOptions: item.customOptions ? JSON.parse(item.customOptions) : null
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tipAmount: order.tipAmount || 0,
      total: order.total,
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber
    }

    return NextResponse.json({ 
      success: true,
      invoice: invoiceData
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate invoice' 
    }, { status: 500 })
  }
}
