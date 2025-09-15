import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Client } from 'pg'

// GET - Fetch menu configuration
export async function GET() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()

    const result = await client.query(`
      SELECT * FROM "MenuConfig" 
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    `)

    await client.end()

    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching menu config:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu configuration' },
      { status: 500 }
    )
  }
}

// POST - Create new menu configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      menuType, 
      title, 
      collections, 
      isActive = true, 
      sortOrder = 0,
      metadata = null 
    } = body

    if (!menuType || !title || !collections) {
      return NextResponse.json(
        { success: false, error: 'Menu type, title, and collections are required' },
        { status: 400 }
      )
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    const query = `
      INSERT INTO "MenuConfig" (
        "menuType", 
        "title", 
        "collections", 
        "isActive", 
        "sortOrder", 
        "metadata", 
        "createdAt", 
        "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    
    const values = [
      menuType,
      title,
      JSON.stringify(collections),
      isActive,
      sortOrder,
      metadata ? JSON.stringify(metadata) : null
    ]
    
    const result = await client.query(query, values)
    const menuConfig = result.rows[0]
    
    await client.end()

    return NextResponse.json({
      success: true,
      data: menuConfig
    })
  } catch (error) {
    console.error('Error creating menu config:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu configuration' },
      { status: 500 }
    )
  }
}
