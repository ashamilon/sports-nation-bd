const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kebgbomwiyfumhrslfgg.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseServiceKey) {
  console.error('❌ Missing Supabase service role key')
  console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Storage buckets to create
const buckets = [
  {
    name: 'products',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 5242880 // 5MB
  },
  {
    name: 'categories',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 5242880 // 5MB
  },
  {
    name: 'badges',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 2097152 // 2MB
  },
  {
    name: 'banners',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 10485760 // 10MB
  },
  {
    name: 'users',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 2097152 // 2MB
  },
  {
    name: 'uploads',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fileSizeLimit: 5242880 // 5MB
  }
]

async function setupSupabaseStorage() {
  try {
    console.log('🚀 Setting up Supabase Storage buckets...')
    
    for (const bucket of buckets) {
      console.log(`\n📦 Creating bucket: ${bucket.name}`)
      
      // Check if bucket already exists
      const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('❌ Error listing buckets:', listError)
        continue
      }
      
      const bucketExists = existingBuckets.some(b => b.name === bucket.name)
      
      if (bucketExists) {
        console.log(`   ✅ Bucket '${bucket.name}' already exists`)
        continue
      }
      
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.fileSizeLimit
      })
      
      if (error) {
        console.error(`   ❌ Error creating bucket '${bucket.name}':`, error.message)
        continue
      }
      
      console.log(`   ✅ Bucket '${bucket.name}' created successfully`)
    }
    
    console.log('\n🎉 Supabase Storage setup completed!')
    console.log('\n📋 Created buckets:')
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    console.log('\n🔧 Next steps:')
    console.log('   1. Add SUPABASE_SERVICE_ROLE_KEY to your environment variables')
    console.log('   2. Add NEXT_PUBLIC_SUPABASE_URL to your environment variables')
    console.log('   3. Deploy your application')
    console.log('   4. Test image uploads in the admin dashboard')
    
  } catch (error) {
    console.error('❌ Error setting up Supabase Storage:', error)
  }
}

setupSupabaseStorage()
