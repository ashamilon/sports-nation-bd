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
      orderId, 
      amount, 
      currency, 
      paymentType, 
      customerLocation 
    } = await request.json()

    // Validate required fields
    if (!orderId || !amount || !currency || !paymentType || !customerLocation) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true
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

    // Calculate payment amount based on location and payment type
    let paymentAmount = amount
    let isPartialPayment = false

    if (customerLocation === 'bangladesh' && paymentType === 'partial') {
      // 20% partial payment for Bangladesh
      paymentAmount = amount * 0.2
      isPartialPayment = true
    } else if (customerLocation === 'europe') {
      // Full payment for Europe
      paymentAmount = amount
      isPartialPayment = false
    }

    // Create payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(paymentAmount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
        userId: session.user.id,
        paymentType,
        customerLocation,
        isPartialPayment: isPartialPayment.toString(),
        originalAmount: amount.toString()
      }
    }

    // Update order with payment information
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'pending',
        paymentMethod: paymentType,
        paymentIntentId: paymentIntent.id
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.id,
      amount: paymentAmount,
      currency,
      isPartialPayment,
      paymentType,
      customerLocation
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
