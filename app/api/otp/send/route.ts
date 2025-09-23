import { NextRequest, NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

export async function POST(request: NextRequest) {
  try {
    const { identifier, type } = await request.json()

    if (!identifier || !type) {
      return NextResponse.json(
        { success: false, message: 'Identifier and type are required' },
        { status: 400 }
      )
    }

    if (type === 'phone') {
      const result = await otpService.sendPhoneOTP(identifier)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    } else if (type === 'email') {
      const result = await otpService.sendEmailOTP(identifier)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be phone or email' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
