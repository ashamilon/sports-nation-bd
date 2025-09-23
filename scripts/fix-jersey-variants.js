const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixJerseyVariants() {
  try {
    console.log('🔧 Fixing jersey variants structure...');
    
    // Get all jersey products
    const jerseyProducts = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'jersey', mode: 'insensitive' } },
          { name: { contains: 'shirt', mode: 'insensitive' } },
          { name: { contains: 'Real Madrid', mode: 'insensitive' } },
          { name: { contains: 'Barcelona', mode: 'insensitive' } }
        ]
      },
      include: {
        ProductVariant: true,
        Category: true
      }
    });

    console.log(`📦 Found ${jerseyProducts.length} jersey products`);

    for (const product of jerseyProducts) {
      console.log(`\n🏷️  Processing: ${product.name}`);
      
      // Check if this product already has the new variant structure
      const hasNewStructure = product.ProductVariant.some(v => v.fabricType);
      
      if (hasNewStructure) {
        console.log('   ✅ Already has new variant structure');
        continue;
      }

      // Clear existing variants
      await prisma.productVariant.deleteMany({
        where: { productId: product.id }
      });

      // Create new variant structure with fabric types and sizes
      const newVariants = [
        {
          name: 'Fabric Type',
          value: 'Fan Version',
          price: product.price,
          stock: Math.floor(product.stock / 2),
          fabricType: 'Fan Version',
          sizes: JSON.stringify([
            { size: 'S', price: product.price, stock: 5 },
            { size: 'M', price: product.price, stock: 8 },
            { size: 'L', price: product.price, stock: 10 },
            { size: 'XL', price: product.price + 100, stock: 7 },
            { size: '2XL', price: product.price + 200, stock: 5 },
            { size: '3XL', price: product.price + 300, stock: 3 }
          ]),
          productId: product.id
        },
        {
          name: 'Fabric Type',
          value: 'Player Version',
          price: product.price + 1000,
          stock: Math.floor(product.stock / 2),
          fabricType: 'Player Version',
          sizes: JSON.stringify([
            { size: 'S', price: product.price + 1000, stock: 3 },
            { size: 'M', price: product.price + 1000, stock: 5 },
            { size: 'L', price: product.price + 1000, stock: 7 },
            { size: 'XL', price: product.price + 1100, stock: 5 },
            { size: '2XL', price: product.price + 1200, stock: 3 },
            { size: '3XL', price: product.price + 1300, stock: 2 }
          ]),
          productId: product.id
        }
      ];

      // Create the new variants
      for (const variant of newVariants) {
        await prisma.productVariant.create({
          data: variant
        });
      }

      // Update product to allow name/number customization
      await prisma.product.update({
        where: { id: product.id },
        data: {
          allowNameNumber: true,
          nameNumberPrice: 250
        }
      });

      console.log('   ✅ Updated with new variant structure');
    }

    console.log('\n🎉 Jersey variants fixed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Added Fan Version and Player Version fabric types');
    console.log('   - Added size variants (S, M, L, XL, 2XL, 3XL)');
    console.log('   - Enabled name/number customization');
    console.log('   - Set name/number price to ৳250');

  } catch (error) {
    console.error('❌ Error fixing jersey variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixJerseyVariants();
