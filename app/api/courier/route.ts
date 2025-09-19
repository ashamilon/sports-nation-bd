import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { pathaoCourier, PathaoOrderRequest } from '@/lib/courier/pathao'

const prisma = new PrismaClient()

// POST - Create courier order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order details from database
    console.log('Looking for order with ID:', orderId)
    const order = await prisma.order.findFirst({
      where: { 
        OR: [
          { id: orderId },
          { orderNumber: orderId }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                weight: true
              }
            }
          }
        }
      }
    })

    console.log('Order found:', order ? 'YES' : 'NO')
    if (order) {
      console.log('Order details:', { id: order.id, orderNumber: order.orderNumber, status: order.status })
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order already has courier assigned
    if (order.courierService) {
      return NextResponse.json(
        { success: false, message: 'Order already has courier assigned' },
        { status: 400 }
      )
    }

    // Prepare Pathao order request
    const pathaoOrder: PathaoOrderRequest = {
      merchant_order_id: order.orderNumber,
      recipient_name: order.shippingAddress.name,
      recipient_phone: order.shippingAddress.phone,
      recipient_address: order.shippingAddress.address,
      recipient_city: order.shippingAddress.city,
      recipient_zone: order.shippingAddress.area,
      delivery_type: '48', // 48 hours delivery
      item_type: '2', // Parcel
      item_quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      item_weight: order.items.reduce((sum, item) => sum + (item.product.weight * item.quantity), 0),
      item_description: order.items.map(item => `${item.product.name} (${item.quantity}x)`).join(', '),
      item_price: order.total,
      item_category: 'Sports & Fitness',
      special_instruction: 'Handle with care',
      item_sku: order.items.map(item => item.product.name).join(', '),
      pickup_address: 'Sports Nation BD, Dhaka',
      pickup_city: 'Dhaka',
      pickup_zone: 'Dhanmondi'
    }

    console.log('Creating Pathao order with data:', pathaoOrder)

    // Create order with Pathao
    const pathaoResponse = await pathaoCourier.createOrder(pathaoOrder)
    
    console.log('Pathao response:', pathaoResponse)

    if (pathaoResponse.success && pathaoResponse.data) {
      // Update order in database with courier information
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          courierService: 'pathao',
          courierTrackingId: pathaoResponse.data.order_id?.toString(),
          status: 'processing' // Update status to processing
        }
      })

      console.log('Order updated in database:', updatedOrder.id)

      return NextResponse.json({
        success: true,
        message: 'Courier order created successfully',
        data: {
          orderId: updatedOrder.id,
          courierTrackingId: pathaoResponse.data.order_id,
          courierService: 'pathao'
        }
      })
    } else {
      console.error('Pathao order creation failed:', pathaoResponse)
      return NextResponse.json(
        { 
          success: false, 
          message: pathaoResponse.message || 'Failed to create courier order' 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error creating courier order:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create courier order',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}


