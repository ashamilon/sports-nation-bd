import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathaoService } from '@/lib/pathao-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, ...data } = await request.json()

    switch (action) {
      case 'create':
        const order = await pathaoService.createOrder(data)
        
        // Save order to database
        try {
          await prisma.pathaoOrder.create({
            data: {
              consignmentId: order.consignment_id,
              merchantOrderId: order.merchant_order_id,
              storeId: data.store_id,
              recipientName: data.recipient_name,
              recipientPhone: data.recipient_phone,
              recipientSecondaryPhone: data.recipient_secondary_phone,
              recipientAddress: data.recipient_address,
              recipientCity: data.recipient_city,
              recipientZone: data.recipient_zone,
              recipientArea: data.recipient_area,
              deliveryType: data.delivery_type,
              itemType: data.item_type,
              specialInstruction: data.special_instruction,
              itemQuantity: data.item_quantity,
              itemWeight: data.item_weight,
              itemDescription: data.item_description,
              amountToCollect: data.amount_to_collect,
              orderStatus: order.order_status,
              deliveryFee: order.delivery_fee,
              userId: session.user.id
            }
          })
        } catch (dbError) {
          console.error('Failed to save order to database:', dbError)
          // Continue with the response even if database save fails
        }
        
        return NextResponse.json({ success: true, data: order })
      
      case 'create-bulk':
        const bulkResult = await pathaoService.createBulkOrders(data.orders)
        return NextResponse.json({ success: true, data: bulkResult })
      
      case 'calculate-price':
        const price = await pathaoService.calculatePrice(data)
        return NextResponse.json({ success: true, data: price })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to process order' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const consignmentId = searchParams.get('consignmentId')

    if (!consignmentId) {
      return NextResponse.json({ error: 'Consignment ID is required' }, { status: 400 })
    }

    const orderInfo = await pathaoService.getOrderInfo(consignmentId)
    return NextResponse.json({ success: true, data: orderInfo })
  } catch (error) {
    console.error('Get order info error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get order info' 
    }, { status: 500 })
  }
}
