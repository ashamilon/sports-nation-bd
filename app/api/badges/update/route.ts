import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function PUT(request: Request) {
  try {
    const { badges } = await request.json()
    
    if (!badges || !Array.isArray(badges)) {
      return NextResponse.json({ error: 'Invalid badges data' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'lib', 'badges.json')
    
    // Write the updated badges array to the JSON file with proper structure
    const badgesData = { badges }
    await fs.writeFile(filePath, JSON.stringify(badgesData, null, 2), 'utf8')

    return NextResponse.json({ success: true, message: 'Badges updated successfully' })
  } catch (error) {
    console.error('Error updating badges:', error)
    return NextResponse.json({ error: 'Failed to update badges' }, { status: 500 })
  }
}
