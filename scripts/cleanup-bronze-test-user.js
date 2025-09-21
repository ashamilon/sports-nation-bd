const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupBronzeTestUser() {
  try {
    console.log('🧹 Cleaning up Bronze Test User...')

    const testEmail = 'bronze-test@example.com'
    
    const deletedUser = await prisma.user.deleteMany({
      where: { email: testEmail }
    })

    if (deletedUser.count > 0) {
      console.log('✅ Bronze test user cleaned up successfully!')
      console.log(`   - Deleted ${deletedUser.count} user(s)`)
    } else {
      console.log('ℹ️  No bronze test user found to clean up')
    }

  } catch (error) {
    console.error('❌ Error cleaning up bronze test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
cleanupBronzeTestUser()
