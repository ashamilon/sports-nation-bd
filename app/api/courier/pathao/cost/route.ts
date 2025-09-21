import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathaoCourier } from '@/lib/courier/pathao'

// Calculate Pathao delivery cost
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { cityId, zoneId, areaId, weight = 0.5 } = body

    if (!cityId || !zoneId || !areaId) {
      return NextResponse.json(
        { error: 'City ID, Zone ID, and Area ID are required' },
        { status: 400 }
      )
    }

    const deliveryCosts = await pathaoCourier.calculateDeliveryCost(
      parseInt(cityId),
      parseInt(zoneId),
      parseInt(areaId),
      parseFloat(weight)
    )

    return NextResponse.json({
      success: true,
      data: deliveryCosts
    })

  } catch (error) {
    console.error('Pathao cost calculation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to calculate delivery cost',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
