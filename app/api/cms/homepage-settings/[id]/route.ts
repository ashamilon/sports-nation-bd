import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Client } from 'pg'

// GET - Fetch single homepage setting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    const result = await client.query('SELECT * FROM "HomepageSettings" WHERE id = $1', [id])
    
    await client.end()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Homepage setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage setting' },
      { status: 500 }
    )
  }
}

// PUT - Update homepage setting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sectionName, isVisible, sortOrder, metadata } = body

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()

    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramCount = 1

    if (sectionName !== undefined) {
      updateFields.push(`"sectionName" = $${paramCount}`)
      values.push(sectionName)
      paramCount++
    }
    if (isVisible !== undefined) {
      updateFields.push(`"isVisible" = $${paramCount}`)
      values.push(isVisible)
      paramCount++
    }
    if (sortOrder !== undefined) {
      updateFields.push(`"sortOrder" = $${paramCount}`)
      values.push(sortOrder)
      paramCount++
    }
    if (metadata !== undefined) {
      updateFields.push(`"metadata" = $${paramCount}`)
      values.push(metadata ? JSON.stringify(metadata) : null)
      paramCount++
    }

    updateFields.push(`"updatedAt" = NOW()`)
    values.push(id)

    const query = `
      UPDATE "HomepageSettings" 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await client.query(query, values)
    
    await client.end()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Homepage setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage setting' },
      { status: 500 }
    )
  }
}

// DELETE - Delete homepage setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.homepageSettings.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage setting deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting homepage setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete homepage setting' },
      { status: 500 }
    )
  }
}

