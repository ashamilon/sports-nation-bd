import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image.' },
        { status: 400 }
      )
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      return NextResponse.json(
        { success: false, error: 'File exceeds 2MB limit.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = path.extname(file.name)
    const uniqueFilename = `profile-${session.user.id}-${Date.now()}${fileExtension}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filePath = path.join(uploadDir, uniqueFilename)
    await fs.writeFile(filePath, buffer)

    // Update user's image in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: `/uploads/profiles/${uniqueFilename}`,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile image uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
