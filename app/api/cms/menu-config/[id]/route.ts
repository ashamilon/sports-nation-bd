import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Client } from 'pg'

// GET - Fetch single menu configuration
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

    const result = await client.query('SELECT * FROM "MenuConfig" WHERE id = $1', [id])

    await client.end()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching menu configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu configuration' },
      { status: 500 }
    )
  }
}

// PUT - Update menu configuration
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
    const { 
      menuType, 
      title, 
      collections, 
      isActive, 
      sortOrder, 
      metadata 
    } = body

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()

    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramCount = 1

    if (menuType !== undefined) {
      updateFields.push(`"menuType" = $${paramCount}`)
      values.push(menuType)
      paramCount++
    }
    if (title !== undefined) {
      updateFields.push(`"title" = $${paramCount}`)
      values.push(title)
      paramCount++
    }
    if (collections !== undefined) {
      updateFields.push(`"collections" = $${paramCount}`)
      values.push(JSON.stringify(collections))
      paramCount++
    }
    if (isActive !== undefined) {
      updateFields.push(`"isActive" = $${paramCount}`)
      values.push(isActive)
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
      UPDATE "MenuConfig"
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await client.query(query, values)

    await client.end()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating menu configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu configuration' },
      { status: 500 }
    )
  }
}

// DELETE - Delete menu configuration
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

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    
    const result = await client.query('DELETE FROM "MenuConfig" WHERE id = $1', [id])
    
    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Menu configuration deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting menu configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu configuration' },
      { status: 500 }
    )
  }
}
