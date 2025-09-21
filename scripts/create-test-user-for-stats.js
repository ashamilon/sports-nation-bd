const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User for Stats',
        email: `testuser-${Date.now()}@example.com`,
        password: '$2a$10$dummy.hash.for.testing', // Dummy hash
        role: 'customer',
        updatedAt: new Date() // This will make them appear as recently active
      }
    });

    console.log('✅ Test user created:', testUser);

    // Create a test order for today
    const testOrder = await prisma.order.create({
      data: {
        orderNumber: `TEST-${Date.now()}`,
        userId: testUser.id,
        status: 'confirmed',
        paymentStatus: 'paid',
        subtotal: 2500,
        shippingCost: 0,
        total: 2500,
        shippingAddress: JSON.stringify({
          street: '123 Test Street',
          city: 'Dhaka',
          state: 'Dhaka',
          zipCode: '1000',
          country: 'Bangladesh'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Test order created:', testOrder);

    console.log('\n🎯 Test Setup Complete!');
    console.log('📊 Dashboard stats should now show:');
    console.log('   - Today\'s Sales: ৳2,500');
    console.log('   - New Orders: 1');
    console.log('   - Active Users: 1+ (including this test user)');
    console.log('\n🔗 Login to admin dashboard to verify real-time sync');
    console.log('   Admin: admin@sportsnationbd.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
