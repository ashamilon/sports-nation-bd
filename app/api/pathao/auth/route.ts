import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathaoService } from '@/lib/pathao-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'test-connection') {
      // Test the connection by getting stores
      const stores = await pathaoService.getStores()
      return NextResponse.json({ 
        success: true, 
        message: 'Connection successful',
        stores: stores.length
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Pathao auth error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }, { status: 500 })
  }
}
