const { Client } = require('pg')

const client = new Client({
  connectionString: "postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
})

async function checkSchema() {
  try {
    await client.connect()
    console.log('🔍 Checking database schema...')
    
    // Check User table structure
    console.log('\n👤 User table structure:')
    const userColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)
    userColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    // Check if admin user exists
    console.log('\n🔑 Checking admin user:')
    const adminUser = await client.query(`
      SELECT id, email, name, role, password IS NOT NULL as has_password
      FROM "User" 
      WHERE email = 'admin@sportsnation.com'
    `)
    
    if (adminUser.rows.length > 0) {
      console.log('✅ Admin user found:', adminUser.rows[0])
    } else {
      console.log('❌ Admin user not found')
    }
    
    // Check Product table structure
    console.log('\n📦 Product table structure:')
    const productColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Product' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)
    productColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    // Check Collection table structure
    console.log('\n📁 Collection table structure:')
    const collectionColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Collection' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)
    collectionColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

checkSchema()

