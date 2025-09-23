import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (published === 'true') {
      where.isPublished = true
    }
    if (featured === 'true') {
      where.isFeatured = true
    }
    if (category) {
      where.category = category
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.blogPost.count({ where })

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST - Create new blog post
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
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      isPublished,
      category,
      tags,
      isFeatured
    } = body

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post with this slug already exists' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        metaTitle,
        metaDescription,
        metaKeywords,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: session.user.id,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        isFeatured,
        updatedAt: new Date()
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
