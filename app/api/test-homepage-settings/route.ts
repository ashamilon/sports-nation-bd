import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    const result = await client.query('SELECT * FROM "HomepageSettings" ORDER BY "sortOrder"')
    
    await client.end()

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error testing homepage settings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      },
      { status: 500 }
    )
  }
}
