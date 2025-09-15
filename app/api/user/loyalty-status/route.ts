import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoyaltySystem } from '@/lib/loyalty-system'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const loyaltyStatus = await LoyaltySystem.getUserLoyaltyStatus(session.user.id)

    if (!loyaltyStatus) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(loyaltyStatus)
  } catch (error) {
    console.error('Error fetching loyalty status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty status' },
      { status: 500 }
    )
  }
}

