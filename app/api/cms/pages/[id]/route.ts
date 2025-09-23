import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        PageSection: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PUT - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      metaKeywords,
      template,
      isPublished,
      sections
    } = body

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id }
    })

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      metaKeywords,
      template,
      isPublished
    }

    // Set publishedAt if publishing for the first time
    if (isPublished && !existingPage.isPublished) {
      updateData.publishedAt = new Date()
    }

    const page = await prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        PageSection: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Update sections if provided
    if (sections) {
      // Delete existing sections
      await prisma.pageSection.deleteMany({
        where: { pageId: id }
      })

      // Create new sections
      await prisma.pageSection.createMany({
        data: sections.map((section: any, index: number) => ({
          pageId: id,
          title: section.title,
          content: section.content,
          type: section.type || 'text',
          order: section.order || index,
          metadata: section.metadata ? JSON.stringify(section.metadata) : null
        }))
      })

      // Fetch updated page with sections
      const updatedPage = await prisma.page.findUnique({
        where: { id },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          PageSection: {
            orderBy: { order: 'asc' }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedPage
      })
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    await prisma.page.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
