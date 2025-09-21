const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createBronzeTestUser() {
  try {
    console.log('🧪 Creating Bronze Test User for Browser Testing...')

    const testEmail = 'bronze-test@example.com'
    const testPassword = 'test123'
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testEmail }
    })

    const testUser = await prisma.user.create({
      data: {
        name: 'Bronze Test User',
        email: testEmail,
        password: hashedPassword,
        phone: '+880123456789',
        role: 'customer',
        country: 'Bangladesh',
        loyaltyLevel: 'bronze',
        firstOrderDiscountUsed: false,
        emailVerified: new Date() // Mark as verified for testing
      }
    })

    console.log('✅ Bronze test user created successfully!')
    console.log('📊 User Details:')
    console.log(`   - Name: ${testUser.name}`)
    console.log(`   - Email: ${testUser.email}`)
    console.log(`   - Password: ${testPassword}`)
    console.log(`   - Loyalty Level: ${testUser.loyaltyLevel}`)
    console.log(`   - Country: ${testUser.country}`)
    console.log(`   - First Order Discount Used: ${testUser.firstOrderDiscountUsed}`)
    console.log(`   - Email Verified: ${testUser.emailVerified ? 'Yes' : 'No'}`)

    console.log('\n🔍 How to Test:')
    console.log('1. Go to http://localhost:3000/auth/signin')
    console.log(`2. Login with email: ${testEmail}`)
    console.log(`3. Password: ${testPassword}`)
    console.log('4. Add items to cart (total should be 1000+ TK)')
    console.log('5. Go to checkout')
    console.log('6. The bronze discount should be applied automatically')
    console.log('7. You should see "First order bonus applied!" message')

    console.log('\n🎯 Expected Behavior:')
    console.log('- First order: 50 TK discount (first order bonus)')
    console.log('- Subsequent orders: 50 TK discount (regular bronze discount)')
    console.log('- Orders below 1000 TK: No discount')
    console.log('- Only works for users in Bangladesh')

    console.log('\n📝 Note: This user will persist in the database for testing.')
    console.log('   To clean up later, run: node scripts/cleanup-bronze-test-user.js')

  } catch (error) {
    console.error('❌ Error creating bronze test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createBronzeTestUser()
