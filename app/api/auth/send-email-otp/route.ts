import { NextRequest, NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email OTP
    const result = await otpService.sendEmailOTP(email)

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        success: true
      })
    } else {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Email OTP sending error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Verify email OTP
    const result = await otpService.verifyOTP(email, otp)

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        verified: true
      })
    } else {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Email OTP verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
