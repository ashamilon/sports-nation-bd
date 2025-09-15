const { Client } = require('pg')

const client = new Client({
  connectionString: "postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
})

async function addMissingColumns() {
  try {
    await client.connect()
    console.log('🔧 Adding missing columns to database...')
    
    // Add missing columns to Product table
    console.log('\n📦 Adding missing columns to Product table...')
    try {
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "comparePrice" DECIMAL(10,2)`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sku" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weight" DECIMAL(8,2)`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "dimensions" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "material" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "color" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "size" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gender" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ageGroup" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sport" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "season" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "careInstructions" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "warranty" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "shippingInfo" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "returnPolicy" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "metaKeywords" TEXT`)
      console.log('✅ Product table columns added')
    } catch (error) {
      console.log('⚠️  Some Product columns might already exist:', error.message)
    }
    
    console.log('\n🎉 Missing columns added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

addMissingColumns()

