import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathaoService } from '@/lib/pathao-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const cityId = searchParams.get('cityId')
    const zoneId = searchParams.get('zoneId')

    let data

    switch (type) {
      case 'cities':
        data = await pathaoService.getCities()
        break
      case 'zones':
        if (!cityId) {
          return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
        }
        data = await pathaoService.getZonesByCity(parseInt(cityId))
        break
      case 'areas':
        if (!zoneId) {
          return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 })
        }
        data = await pathaoService.getAreasByZone(parseInt(zoneId))
        break
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get locations' 
    }, { status: 500 })
  }
}
