import { NextRequest, NextResponse } from 'next/server'
import { smsService } from '@/lib/sms-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, testType = 'order', apiKey, senderId } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Create a custom SMS service instance with provided credentials
    let customSmsService = smsService
    let originalConfig = null
    
    if (apiKey && senderId) {
      // Temporarily override the SMS service config for testing
      originalConfig = smsService['config']
      smsService['config'] = {
        ...originalConfig,
        apiKey: apiKey,
        senderId: senderId
      }
    }

    let result

    if (testType === 'order') {
      // Send test order confirmation
      result = await customSmsService.sendOrderConfirmation({
        phone,
        orderNumber: 'TEST-001',
        customerName: 'Test Customer',
        totalAmount: 1500,
        deliveryAddress: 'Test Address, Dhaka, Bangladesh',
        items: [
          { name: 'Test Jersey', quantity: 1 },
          { name: 'Test Shoes', quantity: 1 }
        ]
      })
    } else {
      // Send simple test SMS
      result = await customSmsService.sendTestSMS(phone)
    }

    // Restore original config
    if (apiKey && senderId && originalConfig) {
      smsService['config'] = originalConfig
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test SMS sent successfully',
        messageId: result.messageId,
        testType
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to send test SMS',
          testType
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test SMS API error:', error)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const testType = searchParams.get('type') || 'order'

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required as query parameter' },
        { status: 400 }
      )
    }

    let result

    if (testType === 'order') {
      result = await smsService.sendOrderConfirmation({
        phone,
        orderNumber: 'TEST-001',
        customerName: 'Test Customer',
        totalAmount: 1500,
        deliveryAddress: 'Test Address, Dhaka, Bangladesh',
        items: [
          { name: 'Test Jersey', quantity: 1 },
          { name: 'Test Shoes', quantity: 1 }
        ]
      })
    } else {
      result = await smsService.sendTestSMS(phone)
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test SMS sent successfully',
        messageId: result.messageId,
        testType,
        phone: phone
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to send test SMS',
          testType,
          phone: phone
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Test SMS GET API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
