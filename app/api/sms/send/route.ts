import { NextRequest, NextResponse } from 'next/server'
import { smsService } from '@/lib/sms-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      phone, 
      orderNumber, 
      customerName, 
      totalAmount, 
      deliveryAddress, 
      items 
    } = body

    // Validate required fields
    if (!phone || !orderNumber || !customerName || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, orderNumber, customerName, totalAmount' },
        { status: 400 }
      )
    }

    // Send SMS
    const result = await smsService.sendOrderConfirmation({
      phone,
      orderNumber,
      customerName,
      totalAmount,
      deliveryAddress: deliveryAddress || 'Address not provided',
      items: items || []
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'SMS sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to send SMS' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('SMS API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Test SMS endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const result = await smsService.sendTestSMS(phone)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test SMS sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to send test SMS' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test SMS API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
