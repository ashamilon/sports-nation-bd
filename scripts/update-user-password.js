const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUserPassword() {
  try {
    const email = 'ashami4lon@gmail.com';
    const newPassword = 'SportsNation2024!'; // New secure password
    
    console.log('🔐 Updating password for:', email);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 New Password:', newPassword);
    console.log('👤 User ID:', updatedUser.id);
    console.log('👤 User Name:', updatedUser.name);
    console.log('👤 User Role:', updatedUser.role);
    
    console.log('\n🎯 You can now login with:');
    console.log('   Email: ashami4lon@gmail.com');
    console.log('   Password: SportsNation2024!');
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ User not found with email: ashami4lon@gmail.com');
      console.log('💡 The account might not exist yet.');
    } else {
      console.error('❌ Error updating password:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPassword();
