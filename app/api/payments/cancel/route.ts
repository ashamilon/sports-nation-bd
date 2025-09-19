import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, transactionId, reason } = body

    console.log('Payment cancel callback received:', { orderId, transactionId, reason })

    // For now, just redirect to the cancel page
    // In the future, you might want to update the order status in the database
    return NextResponse.redirect(new URL('/payment/cancel', request.url || 'http://localhost:3000'))

  } catch (error) {
    console.error('Payment cancel callback error:', error)
    return NextResponse.redirect(new URL('/payment/cancel', request.url || 'http://localhost:3000'))
  }
}

// Handle GET requests for payment cancel page redirects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url || 'http://localhost:3000')
    const orderId = searchParams.get('order_id')
    const transactionId = searchParams.get('transaction_id')
    const status = searchParams.get('status')

    console.log('Payment cancel GET request:', { orderId, transactionId, status })

    // Redirect to cancel page
    return NextResponse.redirect(new URL('/payment/cancel', request.url || 'http://localhost:3000'))

  } catch (error) {
    console.error('Payment cancel GET error:', error)
    return NextResponse.redirect(new URL('/payment/cancel', request.url || 'http://localhost:3000'))
  }
}
