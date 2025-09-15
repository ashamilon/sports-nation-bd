import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL environment variable not found',
        env: process.env.NODE_ENV
      }, { status: 500 })
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    console.log('✅ Connected to database successfully')

    // Test a simple query
    const result = await client.query('SELECT COUNT(*) as count FROM "Collection"')
    const collectionCount = result.rows[0].count

    await client.end()
    console.log('✅ Database test completed')

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collectionCount: parseInt(collectionCount),
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
