import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Client } from 'pg'

// GET - Fetch all homepage settings
export async function GET() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    const result = await client.query('SELECT * FROM "HomepageSettings" ORDER BY "sortOrder" ASC')
    
    await client.end()

    const response = NextResponse.json({
      success: true,
      data: result.rows
    })
    
    // Add caching headers for better performance (but allow cache busting)
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300') // 5 minutes cache
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  } catch (error) {
    console.error('Error fetching homepage settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage settings' },
      { status: 500 }
    )
  }
}

// POST - Create new homepage setting
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
    const { sectionKey, sectionName, isVisible, sortOrder, metadata } = body

    if (!sectionKey || !sectionName) {
      return NextResponse.json(
        { success: false, error: 'Section key and name are required' },
        { status: 400 }
      )
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    // Generate unique ID for the homepage setting
    const id = `homepage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const query = `
      INSERT INTO "HomepageSettings" (
        "id",
        "sectionKey", 
        "sectionName", 
        "isVisible", 
        "sortOrder", 
        "metadata", 
        "createdAt", 
        "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    
    const values = [
      id,
      sectionKey,
      sectionName,
      isVisible ?? true,
      sortOrder ?? 0,
      metadata ? JSON.stringify(metadata) : null
    ]
    
    const result = await client.query(query, values)
    const setting = result.rows[0]
    
    await client.end()

    return NextResponse.json({
      success: true,
      data: setting
    })
  } catch (error) {
    console.error('Error creating homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create homepage setting' },
      { status: 500 }
    )
  }
}

