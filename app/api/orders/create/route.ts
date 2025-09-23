import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { detectUserLocation, getDeliveryPolicy, calculateShippingCost } from '@/lib/localization'

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
      items, 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      customerLocation,
      tipAmount = 0
    } = await request.json()

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { message: 'Shipping and billing addresses are required' },
        { status: 400 }
      )
    }

    // Detect location if not provided
    const location = customerLocation || detectUserLocation()
    const policy = getDeliveryPolicy(location)

    // Calculate order total
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const productVariant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { Product: true }
      })

      if (!productVariant) {
        return NextResponse.json(
          { message: `Product variant ${item.variantId} not found` },
          { status: 404 }
        )
      }

      if (productVariant.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${productVariant.Product.name}` },
          { status: 400 }
        )
      }

      if (!productVariant.price) {
        return NextResponse.json(
          { message: `Price not available for ${productVariant.Product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = productVariant.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: productVariant.productId,
        productVariantId: item.variantId,
        quantity: item.quantity,
        price: productVariant.price,
        customOptions: item.customOptions ? JSON.stringify(item.customOptions) : null
      })
    }

    // Calculate shipping cost
    const shippingCost = calculateShippingCost(subtotal, location)
    const total = subtotal + shippingCost + tipAmount

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || 'card',
        subtotal,
        shippingCost,
        tipAmount,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        customerLocation: location,
        OrderItem: {
          create: orderItems
        }
      },
      include: {
        OrderItem: {
          include: {
            Product: true,
            ProductVariant: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
