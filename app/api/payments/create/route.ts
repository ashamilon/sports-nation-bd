import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { paymentService, PaymentRequest } from '@/lib/payment-service'
import { prisma } from '@/lib/prisma'
import { paymentStatus } from '@/lib/payment-config'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // For testing purposes, use the admin user if no session
    let userId = session?.user?.id
    if (!userId) {
      // Use the admin user ID for testing
      userId = 'cmfevp4s60000xfuve22ht1i6'
    }

    const body = await request.json()
    const { 
      items, 
      customerInfo, 
      currency = 'BDT',
      paymentType = 'full',
      subtotal,
      deliveryCharge = 0,
      tipAmount = 0,
      totalAmount,
      remainingAmount = 0,
      returnUrl,
      cancelUrl,
      failUrl 
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 })
    }

    // Calculate the full order total from items
    const calculatedSubtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)
    
    // Calculate the full order total (subtotal + delivery + tip)
    const fullOrderTotal = calculatedSubtotal + (deliveryCharge || 0) + (tipAmount || 0)
    
    // The final total should be the full order amount for the order record
    const finalTotal = fullOrderTotal

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const orderNumber = orderId

    // Validate product IDs exist in database
    const productIds = items.map((item: any) => item.productId)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    })
    const existingProductIds = existingProducts.map(p => p.id)
    
    // Filter out items with invalid product IDs
    const validItems = items.filter((item: any) => existingProductIds.includes(item.productId))
    
    if (validItems.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
    }

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        userId: userId,
        status: 'pending',
        subtotal: subtotal || calculatedSubtotal,
        shippingCost: deliveryCharge || 0,
        tipAmount: tipAmount || 0,
        total: finalTotal,
        currency,
        paymentMethod: paymentType === 'partial' ? 'partial_payment' : 'full_payment',
        shippingAddress: JSON.stringify({
          ...customerInfo,
          paymentType,
          tipAmount: tipAmount || 0,
          remainingAmount: remainingAmount || 0
        }),
        OrderItem: {
          create: validItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customOptions: item.customOptions ? JSON.stringify(item.customOptions) : null
          }))
        }
      },
      include: {
        OrderItem: {
          include: {
            Product: true
          }
        }
      }
    })

    // Prepare payment request
    // Use the totalAmount passed from checkout (which is already the correct payment amount)
    const paymentAmount = totalAmount || finalTotal
    const paymentRequest: PaymentRequest = {
      amount: paymentAmount,
      currency,
      orderId,
      customerInfo,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitAmount: item.price,
        category: 'Sports'
      })),
      returnUrl: returnUrl || `${process.env.NEXTAUTH_URL}/api/payments/success`,
      cancelUrl: cancelUrl || `${process.env.NEXTAUTH_URL}/payment/cancel`,
      failUrl: failUrl || `${process.env.NEXTAUTH_URL}/payment/failed`
    }

    // Create payment session
    const paymentResponse = await paymentService.createPayment(paymentRequest)

    if (paymentResponse.success) {
      // Create payment record
      await prisma.payment.create({
        data: {
          orderId: order.id, // Use the actual order ID, not orderNumber
          amount: paymentAmount,
          currency,
          status: paymentStatus.PENDING,
          transactionId: paymentResponse.orderId || orderId,
          paymentMethod: 'sslcommerz',
          metadata: JSON.stringify({
            paymentUrl: paymentResponse.paymentUrl,
            sessionKey: paymentResponse.sessionKey,
            gateway: paymentResponse.gateway,
            customerInfo,
            paymentType,
            tipAmount: tipAmount || 0,
            remainingAmount: remainingAmount || 0,
            totalOrderAmount: finalTotal
          })
        }
      })

      return NextResponse.json({
        success: true,
        paymentUrl: paymentResponse.paymentUrl,
        orderId,
        gateway: paymentResponse.gateway
      })
    } else {
      // Update order status to failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'failed' }
      })

      return NextResponse.json({
        success: false,
        error: paymentResponse.error
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
