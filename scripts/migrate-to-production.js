const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateToProduction() {
  try {
    console.log('🚀 Starting migration to production database...')
    
    // Check current database
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    const collectionCount = await prisma.collection.count()
    const bannerCount = await prisma.banner.count()
    const homepageSettingsCount = await prisma.homepageSettings.count()
    
    console.log('\n📊 Current Database Status:')
    console.log(`👥 Users: ${userCount}`)
    console.log(`📦 Products: ${productCount}`)
    console.log(`📁 Collections: ${collectionCount}`)
    console.log(`🖼️ Banners: ${bannerCount}`)
    console.log(`⚙️ Homepage Settings: ${homepageSettingsCount}`)
    
    console.log('\n🎯 Next Steps:')
    console.log('1. Set up PlanetScale database')
    console.log('2. Update DATABASE_URL in .env.local')
    console.log('3. Run: npx prisma db push')
    console.log('4. Run: npx prisma generate')
    console.log('5. Test locally with new database')
    console.log('6. Deploy to Vercel')
    
    console.log('\n💡 Important:')
    console.log('- Your current SQLite data will be preserved locally')
    console.log('- You can export/import data as needed')
    console.log('- Production database will start fresh')
    console.log('- Admin panel will work exactly the same')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateToProduction()

