const { Client } = require('pg')

const client = new Client({
  connectionString: "postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
})

async function testConnection() {
  try {
    await client.connect()
    console.log('✅ Connected to Supabase')
    
    // Test User table
    console.log('\n👤 Testing User table...')
    const users = await client.query('SELECT id, email, name, role FROM "User" LIMIT 5')
    console.log('Users found:', users.rows.length)
    users.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`)
    })
    
    // Test Product table
    console.log('\n📦 Testing Product table...')
    const products = await client.query('SELECT id, name, price, slug FROM "Product" LIMIT 5')
    console.log('Products found:', products.rows.length)
    products.rows.forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) - slug: ${product.slug}`)
    })
    
    // Test Collection table
    console.log('\n📁 Testing Collection table...')
    const collections = await client.query('SELECT id, name, slug FROM "Collection" LIMIT 5')
    console.log('Collections found:', collections.rows.length)
    collections.rows.forEach(collection => {
      console.log(`  - ${collection.name} - slug: ${collection.slug}`)
    })
    
    // Test HomepageSettings table
    console.log('\n🏠 Testing HomepageSettings table...')
    const settings = await client.query('SELECT "sectionKey", "sectionName", "isVisible" FROM "HomepageSettings" LIMIT 5')
    console.log('Settings found:', settings.rows.length)
    settings.rows.forEach(setting => {
      console.log(`  - ${setting.sectionKey}: ${setting.sectionName} (${setting.isVisible ? 'visible' : 'hidden'})`)
    })
    
    // Test Banner table
    console.log('\n🖼️  Testing Banner table...')
    const banners = await client.query('SELECT id, title, position, "isActive" FROM "Banner" LIMIT 5')
    console.log('Banners found:', banners.rows.length)
    banners.rows.forEach(banner => {
      console.log(`  - ${banner.title} (${banner.position}) - ${banner.isActive ? 'active' : 'inactive'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

testConnection()

