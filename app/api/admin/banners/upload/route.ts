import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
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

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json(
        { success: false, error: 'File exceeds 5MB limit.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = path.extname(file.name)
    const uniqueFilename = `banner-${Date.now()}-${Math.random().toString(36).substr(2, 6)}${fileExtension}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners')
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filePath = path.join(uploadDir, uniqueFilename)
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      file: {
        name: uniqueFilename,
        url: `/uploads/banners/${uniqueFilename}`,
        size: file.size,
        mimeType: file.type,
      },
      message: 'Banner image uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading banner image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

