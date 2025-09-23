import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment-service'
import { prisma } from '@/lib/prisma'
import { paymentStatus } from '@/lib/payment-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract SSL Commerz response data
    const tranId = formData.get('tran_id') as string
    const status = formData.get('status') as string
    const valId = formData.get('val_id') as string
    const amount = parseFloat(formData.get('amount') as string)
    const currency = formData.get('currency') as string
    const cardType = formData.get('card_type') as string
    const storeAmount = parseFloat(formData.get('store_amount') as string)
    const cardNo = formData.get('card_no') as string
    const bankTranId = formData.get('bank_tran_id') as string
    const cardIssuer = formData.get('card_issuer') as string
    const cardBrand = formData.get('card_brand') as string
    const cardSubBrand = formData.get('card_sub_brand') as string
    const cardCategory = formData.get('card_category') as string
    const riskLevel = formData.get('risk_level') as string
    const riskTitle = formData.get('risk_title') as string

    if (!tranId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: tranId },
      include: { Payment: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update payment record with SSL Commerz response
    if (order.Payment && order.Payment.length > 0) {
      await prisma.payment.update({
        where: { id: order.Payment[0].id },
        data: {
          status: status === 'VALID' ? paymentStatus.COMPLETED : paymentStatus.FAILED,
          transactionId: valId || bankTranId,
          metadata: JSON.stringify({
            status,
            valId,
            amount,
            currency,
            cardType,
            storeAmount,
            cardNo: cardNo ? cardNo.substring(0, 6) + '****' + cardNo.substring(cardNo.length - 4) : null,
            bankTranId,
            cardIssuer,
            cardBrand,
            cardSubBrand,
            cardCategory,
            riskLevel,
            riskTitle
          })
        }
      })
    }

    // Update order status
    if (status === 'VALID') {
      await prisma.order.update({
        where: { id: tranId },
        data: { status: 'confirmed' }
      })

      // Update product stock
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: tranId },
        include: { Product: true }
      })

      for (const item of orderItems) {
        if (item.Product.stock >= item.quantity) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        orderId: tranId
      })
    } else {
      await prisma.order.update({
        where: { id: tranId },
        data: { status: 'failed' }
      })

      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        orderId: tranId
      })
    }

  } catch (error) {
    console.error('SSL Commerz callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
