const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupSupabase() {
  try {
    console.log('🚀 Setting up Supabase connection...')
    
    // Test the connection
    await prisma.$connect()
    console.log('✅ Successfully connected to Supabase!')
    
    // Check if we can query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query test successful!')
    
    console.log('\n🎉 Supabase setup complete!')
    console.log('Your admin panel will now work with permanent data storage.')
    
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure you have updated .env.local with your Supabase connection string')
    console.log('2. Run: npx prisma db push')
    console.log('3. Run: npx prisma generate')
    console.log('4. Try this script again')
  } finally {
    await prisma.$disconnect()
  }
}

setupSupabase()

