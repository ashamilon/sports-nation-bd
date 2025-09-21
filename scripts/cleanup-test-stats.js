const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupTestData() {
  try {
    // Delete test orders
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        orderNumber: {
          startsWith: 'TEST-'
        }
      }
    });

    console.log(`✅ Deleted ${deletedOrders.count} test orders`);

    // Delete test users
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'testuser-'
        }
      }
    });

    console.log(`✅ Deleted ${deletedUsers.count} test users`);

    console.log('\n🧹 Cleanup Complete!');
    console.log('📊 Dashboard stats should now show original values');

  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestData();
