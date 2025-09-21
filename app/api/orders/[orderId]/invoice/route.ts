import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInvoiceHTML } from '@/lib/invoice-generator'

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
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Fetch badge information for all items
    const badgeIds = new Set<string>()
    order.OrderItem.forEach(item => {
      if (item.customOptions) {
        try {
          const customOptions = JSON.parse(item.customOptions)
          if (customOptions.badges && Array.isArray(customOptions.badges)) {
            customOptions.badges.forEach((badgeId: string) => badgeIds.add(badgeId))
          }
        } catch (e) {
          console.error('Error parsing custom options:', e)
        }
      }
    })

    // Fetch badge details
    const badgesMap = new Map<string, any>()
    if (badgeIds.size > 0) {
      try {
        const badgesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/badges`)
        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json()
          badgesData.badges.forEach((badge: any) => {
            badgesMap.set(badge.id, badge)
          })
        }
      } catch (e) {
        console.error('Error fetching badges:', e)
      }
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
      items: order.OrderItem.map(item => {
        let customOptions = null
        if (item.customOptions) {
          try {
            customOptions = JSON.parse(item.customOptions)
            // Add badge details to custom options
            if (customOptions.badges && Array.isArray(customOptions.badges)) {
              customOptions.badgeDetails = customOptions.badges.map((badgeId: string) => 
                badgesMap.get(badgeId) || { id: badgeId, name: `Badge ${badgeId}` }
              )
            }
          } catch (e) {
            console.error('Error parsing custom options:', e)
          }
        }
        
        return {
          name: item.Product.name,
          quantity: item.quantity,
          unitPrice: item.price / item.quantity,
          totalPrice: item.price,
          customOptions
        }
      }),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tipAmount: order.tipAmount || 0,
      total: order.total,
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      payments: order.Payment || []
    }

    // Generate HTML invoice
    const htmlInvoice = await generateInvoiceHTML(invoiceData)
    
    return new NextResponse(htmlInvoice, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoiceData.orderNumber}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate invoice' 
    }, { status: 500 })
  }
}
