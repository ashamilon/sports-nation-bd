import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'pending'

    // Get regular orders that haven't been synced to Pathao yet
    const orders = await prisma.order.findMany({
      where: {
        status: status,
        courierService: null, // Orders not yet assigned to courier
        OR: [
          { courierTrackingId: null },
          { courierTrackingId: '' }
        ]
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Format orders for Pathao order management
    const formattedOrders = orders.map(order => {
      const shippingAddress = JSON.parse(order.shippingAddress)
      
      // Calculate total weight (estimate 0.5kg per item)
      const totalWeight = order.OrderItem.reduce((sum, item) => sum + (item.quantity * 0.5), 0)
      
      // Get first product name as description
      const firstProduct = order.OrderItem[0]?.Product
      const itemDescription = firstProduct ? 
        `${firstProduct.name}${order.OrderItem.length > 1 ? ` +${order.OrderItem.length - 1} more` : ''}` : 
        'Multiple items'

      return {
        id: `ecommerce-${order.id}`,
        consignmentId: `ECO-${order.orderNumber}`,
        merchantOrderId: order.orderNumber,
        storeId: 123, // Default store ID
        recipientName: shippingAddress.name || order.User?.name || 'Unknown',
        recipientPhone: shippingAddress.phone || shippingAddress.mobile || 'N/A',
        recipientSecondaryPhone: shippingAddress.secondaryPhone || null,
        recipientAddress: `${shippingAddress.address || ''} ${shippingAddress.city || ''} ${shippingAddress.postalCode || ''}`.trim(),
        recipientCity: 1, // Default to Dhaka
        recipientZone: null,
        recipientArea: null,
        deliveryType: 48, // Normal delivery
        itemType: 2, // Parcel
        specialInstruction: order.notes || null,
        itemQuantity: order.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
        itemWeight: Math.max(totalWeight, 0.5), // Minimum 0.5kg
        itemDescription: itemDescription,
        amountToCollect: order.paymentMethod === 'cod' ? order.total : 0,
        orderStatus: order.status === 'pending' ? 'Pending' : 
                    order.status === 'processing' ? 'Processing' :
                    order.status === 'shipped' ? 'Shipped' :
                    order.status === 'delivered' ? 'Delivered' :
                    order.status === 'cancelled' ? 'Cancelled' : 'Pending',
        deliveryFee: order.shippingCost || 0,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        User: order.User,
        source: 'ecommerce',
        originalOrderId: order.id,
        orderItems: order.OrderItem
      }
    })

    const total = await prisma.order.count({
      where: {
        status: status,
        courierService: null,
        OR: [
          { courierTrackingId: null },
          { courierTrackingId: '' }
        ]
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        orders: formattedOrders,
        total,
        limit,
        offset
      }
    })
  } catch (error) {
    console.error('Sync orders error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to sync orders' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, consignmentId, courierTrackingId } = await request.json()

    if (!orderId || !consignmentId) {
      return NextResponse.json({ error: 'Order ID and Consignment ID are required' }, { status: 400 })
    }

    // Update the original order with courier information
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        courierService: 'pathao',
        courierTrackingId: courierTrackingId || consignmentId,
        status: 'processing'
      }
    })

    // Also create a PathaoOrder record for tracking
    try {
      await prisma.pathaoOrder.create({
        data: {
          consignmentId: consignmentId,
          merchantOrderId: updatedOrder.orderNumber,
          storeId: 123,
          recipientName: 'Synced from E-commerce',
          recipientPhone: 'N/A',
          recipientAddress: 'Synced from E-commerce',
          deliveryType: 48,
          itemType: 2,
          itemQuantity: 1,
          itemWeight: 0.5,
          itemDescription: 'E-commerce order',
          amountToCollect: 0,
          orderStatus: 'Processing',
          deliveryFee: 0,
          userId: session.user.id
        }
      })
    } catch (dbError) {
      console.error('Failed to create PathaoOrder record:', dbError)
      // Continue even if PathaoOrder creation fails
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedOrder 
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update order' 
    }, { status: 500 })
  }
}
