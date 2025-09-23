import { NextRequest, NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp } = await request.json()

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, message: 'Identifier and OTP are required' },
        { status: 400 }
      )
    }

    const result = await otpService.verifyOTP(identifier, otp)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
