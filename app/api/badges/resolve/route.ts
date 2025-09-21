import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// POST /api/badges/resolve - Resolve badge IDs to names
export async function POST(request: NextRequest) {
  try {
    const { badgeIds } = await request.json()

    if (!badgeIds || !Array.isArray(badgeIds)) {
      return NextResponse.json({ 
        error: 'Badge IDs array is required' 
      }, { status: 400 })
    }

    // Read badges from JSON file
    const badgesPath = path.join(process.cwd(), 'lib', 'badges.json')
    const badgesData = JSON.parse(fs.readFileSync(badgesPath, 'utf8'))
    const badges = badgesData.badges
    
    // Create a map for quick lookup
    const badgeMap = new Map(badges.map((badge: any) => [badge.id, badge.name]))
    
    // Resolve badge IDs to names
    const resolvedNames = badgeIds.map(id => badgeMap.get(id) || id) // Fallback to ID if name not found

    return NextResponse.json({ 
      success: true, 
      badgeNames: resolvedNames 
    })
  } catch (error) {
    console.error('Error resolving badge names:', error)
    return NextResponse.json({ 
      error: 'Failed to resolve badge names' 
    }, { status: 500 })
  }
}
