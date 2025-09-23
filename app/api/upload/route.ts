import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToSupabaseStorage, STORAGE_BUCKETS } from '@/lib/supabase-storage'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const folder: string = (data.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Determine bucket based on folder
    let bucket = STORAGE_BUCKETS.GENERAL
    switch (folder.toLowerCase()) {
      case 'products':
        bucket = STORAGE_BUCKETS.PRODUCTS
        break
      case 'categories':
        bucket = STORAGE_BUCKETS.CATEGORIES
        break
      case 'badges':
        bucket = STORAGE_BUCKETS.BADGES
        break
      case 'banners':
        bucket = STORAGE_BUCKETS.BANNERS
        break
      case 'users':
        bucket = STORAGE_BUCKETS.USERS
        break
      default:
        bucket = STORAGE_BUCKETS.GENERAL
    }

    // Create unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    
    // Create path with folder structure
    const path = `${folder}/${filename}`

    console.log('📁 Uploading to Supabase Storage:', {
      filename: file.name,
      size: file.size,
      type: file.type,
      bucket,
      path
    })

    // Upload to Supabase Storage
    const result = await uploadToSupabaseStorage(file, bucket, path, {
      cacheControl: '3600',
      upsert: false
    })

    if (!result.success) {
      console.error('Upload failed:', result.error)
      return NextResponse.json({ 
        error: result.error || 'Upload failed' 
      }, { status: 500 })
    }

    console.log('✅ Upload successful:', result.url)

    return NextResponse.json({
      success: true,
      url: result.url,
      filename,
      path: result.path,
      bucket,
      size: file.size,
      type: file.type,
      message: 'File uploaded successfully to Supabase Storage'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}