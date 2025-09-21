import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoyaltySystem } from '@/lib/loyalty-system'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderAmount, isFirstOrder = false } = await request.json()

    if (!orderAmount || orderAmount < 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        loyaltyLevel: true,
        country: true,
        firstOrderDiscountUsed: true,
        platinumDiscountUsed: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is eligible for loyalty program
    if (!LoyaltySystem.isEligibleForLoyalty(user.country || '')) {
      return NextResponse.json({ 
        discount: 0, 
        message: 'Loyalty program is only available for customers in Bangladesh' 
      })
    }

    const userLevel = user.loyaltyLevel as any
    let discount = 0
    let message = ''

    // Calculate discount based on level
    if (userLevel === 'bronze' && isFirstOrder && !user.firstOrderDiscountUsed) {
      discount = LoyaltySystem.calculateDiscount(session.user.id, userLevel, orderAmount, true)
      message = 'First order bonus applied!'
    } else if (userLevel === 'platinum') {
      const canUse = await LoyaltySystem.canUsePlatinumDiscount(session.user.id)
      if (canUse) {
        discount = LoyaltySystem.calculateDiscount(session.user.id, userLevel, orderAmount)
        message = 'Platinum monthly discount applied!'
      } else {
        message = 'Platinum discount already used this month'
      }
    } else {
      discount = LoyaltySystem.calculateDiscount(session.user.id, userLevel, orderAmount)
      if (discount > 0) {
        message = `${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} member discount applied!`
      }
    }

    // Check minimum order amount
    if (orderAmount < 1000) {
      return NextResponse.json({ 
        discount: 0, 
        message: 'Minimum order amount of 1000৳ required for loyalty discounts' 
      })
    }

    return NextResponse.json({
      discount,
      message,
      userLevel,
      isEligible: true
    })
  } catch (error) {
    console.error('Error calculating loyalty discount:', error)
    return NextResponse.json(
      { error: 'Failed to calculate discount' },
      { status: 500 }
    )
  }
}

