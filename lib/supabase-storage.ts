import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL from DATABASE_URL
function getSupabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL || ''
  
  // Extract project reference from DATABASE_URL
  // Format: postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
  const match = databaseUrl.match(/postgres\.([^.]+)\./)
  if (match) {
    const projectRef = match[1]
    return `https://${projectRef}.supabase.co`
  }
  
  // Fallback to environment variable or default
  return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kebgbomwiyfumhrslfgg.supabase.co'
}

// Get Supabase service key
function getSupabaseServiceKey(): string {
  // Try different environment variable names
  return process.env.SUPABASE_SERVICE_ROLE_KEY || 
         process.env.SUPABASE_ANON_KEY || 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
         ''
}

// Supabase configuration
const supabaseUrl = getSupabaseUrl()
const supabaseServiceKey = getSupabaseServiceKey()

if (!supabaseServiceKey) {
  console.warn('⚠️ Missing Supabase service role key. Image uploads will use placeholder service.')
}

// Create Supabase client with service role key for server-side operations
export const supabaseStorage = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCTS: 'products' as const,
  CATEGORIES: 'categories' as const,
  BADGES: 'badges' as const,
  BANNERS: 'banners' as const,
  USERS: 'users' as const,
  GENERAL: 'uploads' as const
} as const

// Helper function to upload file to Supabase Storage
export async function uploadToSupabaseStorage(
  file: File,
  bucket: string,
  path: string,
  options?: {
    cacheControl?: string
    upsert?: boolean
  }
) {
  // If Supabase is not configured, fall back to placeholder
  if (!supabaseStorage) {
    console.log('📁 Supabase not configured, using placeholder service')
    const timestamp = Date.now()
    const placeholderUrl = `https://picsum.photos/400/400?random=${timestamp}`
    
    return {
      success: true,
      path: `placeholder-${timestamp}`,
      url: placeholderUrl,
      bucket,
      size: file.size,
      type: file.type,
      message: 'Using placeholder service (Supabase not configured)'
    }
  }

  try {
    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer()
    
    // Upload file to Supabase Storage
    const { data, error } = await supabaseStorage.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: file.type,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabaseStorage.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      bucket,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Helper function to delete file from Supabase Storage
export async function deleteFromSupabaseStorage(bucket: string, path: string) {
  if (!supabaseStorage) {
    console.log('📁 Supabase not configured, skipping delete')
    return { success: true }
  }

  try {
    const { error } = await supabaseStorage.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Supabase storage delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

// Helper function to get file URL from Supabase Storage
export function getSupabaseStorageUrl(bucket: string, path: string) {
  if (!supabaseStorage) {
    return `https://picsum.photos/400/400?random=${Date.now()}`
  }

  const { data } = supabaseStorage.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}