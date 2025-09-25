const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  console.error('Please check your .env.local file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorageBuckets() {
  console.log('🚀 Setting up Supabase Storage buckets...')
  
  const buckets = [
    {
      name: 'product-images',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    {
      name: 'banner-images', 
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    {
      name: 'cms-media',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    }
  ]

  for (const bucket of buckets) {
    try {
      console.log(`📦 Creating bucket: ${bucket.name}`)
      
      // Check if bucket exists
      const { data: existingBuckets } = await supabase.storage.listBuckets()
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name)
      
      if (bucketExists) {
        console.log(`✅ Bucket ${bucket.name} already exists`)
        continue
      }
      
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      })
      
      if (error) {
        console.error(`❌ Error creating bucket ${bucket.name}:`, error.message)
      } else {
        console.log(`✅ Successfully created bucket: ${bucket.name}`)
      }
      
    } catch (error) {
      console.error(`❌ Error with bucket ${bucket.name}:`, error.message)
    }
  }
  
  console.log('🎉 Storage setup complete!')
}

setupStorageBuckets().catch(console.error)