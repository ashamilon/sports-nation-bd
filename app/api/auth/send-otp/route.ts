import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database (you might want to create a separate OTP table)
    // For now, we'll use a simple approach
    console.log(`OTP for ${phone}: ${otp}`)

    // TODO: Send SMS using a service like Twilio, AWS SNS, or local SMS gateway
    // For development, we'll just log the OTP

    return NextResponse.json({
      message: 'OTP sent successfully',
      otp, // Remove this in production
      expires: expires.toISOString()
    })

  } catch (error) {
    console.error('OTP sending error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { message: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // TODO: Verify OTP from database
    // For now, we'll accept any 6-digit OTP for testing
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return NextResponse.json({
        message: 'OTP verified successfully',
        verified: true
      })
    } else {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

