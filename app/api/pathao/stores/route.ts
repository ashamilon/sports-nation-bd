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

    const stores = await pathaoService.getStores()
    return NextResponse.json({ success: true, data: stores })
  } catch (error) {
    console.error('Get stores error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get stores' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storeData = await request.json()
    const result = await pathaoService.createStore(storeData)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Create store error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create store' 
    }, { status: 500 })
  }
}
