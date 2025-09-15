import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch content by key or category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')
    const all = searchParams.get('all') === 'true'

    if (all) {
      // Get all content (both active and inactive for admin)
      const content = await prisma.siteContent.findMany({
        orderBy: { category: 'asc' }
      })
      return NextResponse.json(content)
    }

    if (key) {
      // Get specific content by key
      const content = await prisma.siteContent.findUnique({
        where: { key }
      })
      return NextResponse.json(content)
    }

    if (category) {
      // Get content by category
      const content = await prisma.siteContent.findMany({
        where: { 
          category,
          isActive: true 
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(content)
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, title, content, type, category, isActive, metadata } = body

    if (!key || !content) {
      return NextResponse.json({ error: 'Key and content are required' }, { status: 400 })
    }

    // Create new content
    const siteContent = await prisma.siteContent.create({
      data: {
        key,
        title,
        content,
        type: type || 'text',
        category: category || 'general',
        isActive: isActive !== undefined ? isActive : true,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json(siteContent)
  } catch (error) {
    console.error('Error creating/updating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    await prisma.siteContent.delete({
      where: { key }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
