import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET /api/badges - Get all badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    // Read badges from JSON file
    const badgesPath = path.join(process.cwd(), 'lib', 'badges.json')
    const badgesData = JSON.parse(fs.readFileSync(badgesPath, 'utf8'))
    let badges = badgesData.badges

    // Apply filters
    if (category && category !== 'all') {
      badges = badges.filter((badge: any) => badge.category === category)
    }
    
    if (isActive !== null) {
      badges = badges.filter((badge: any) => badge.isActive === (isActive === 'true'))
    }
    
    if (search) {
      badges = badges.filter((badge: any) => 
        badge.name.toLowerCase().includes(search.toLowerCase()) ||
        (badge.description && badge.description.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}

// POST /api/badges - Add new badge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, category, price, isActive } = body

    // Validate required fields
    if (!name || !image || !category) {
      return NextResponse.json({ 
        error: 'Name, image, and category are required' 
      }, { status: 400 })
    }

    // Read current badges
    const badgesPath = path.join(process.cwd(), 'lib', 'badges.json')
    const badgesData = JSON.parse(fs.readFileSync(badgesPath, 'utf8'))
    
    // Create new badge
    const newBadge = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description: description || '',
      image,
      category,
      price: price || 150,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString()
    }

    // Add to badges array
    badgesData.badges.push(newBadge)

    // Write back to file
    fs.writeFileSync(badgesPath, JSON.stringify(badgesData, null, 2))

    return NextResponse.json({ badge: newBadge }, { status: 201 })
  } catch (error) {
    console.error('Error creating badge:', error)
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 })
  }
}
