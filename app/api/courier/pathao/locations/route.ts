import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathaoCourier } from '@/lib/courier/pathao'

// Get Pathao cities, zones, and areas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'cities', 'zones', 'areas'
    const cityId = searchParams.get('cityId')
    const zoneId = searchParams.get('zoneId')

    let data: any = []

    switch (type) {
      case 'cities':
        data = await pathaoCourier.getCities()
        break
      case 'zones':
        if (!cityId) {
          return NextResponse.json(
            { error: 'City ID is required for zones' },
            { status: 400 }
          )
        }
        data = await pathaoCourier.getZones(parseInt(cityId))
        break
      case 'areas':
        if (!zoneId) {
          return NextResponse.json(
            { error: 'Zone ID is required for areas' },
            { status: 400 }
          )
        }
        data = await pathaoCourier.getAreas(parseInt(zoneId))
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be cities, zones, or areas' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Pathao locations error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch location data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
