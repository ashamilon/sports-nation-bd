import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      },
      update: {
        token,
        expires
      },
      create: {
        identifier: email,
        token,
        expires
      }
    })

    // TODO: Send verification email
    // For now, we'll just return the token for testing
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`

    return NextResponse.json({
      message: 'Verification email sent',
      verificationUrl // Remove this in production
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { message: 'Token and email are required' },
        { status: 400 }
      )
    }

    // Verify token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: 'Token has expired' },
        { status: 400 }
      )
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    })

    return NextResponse.json({
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

