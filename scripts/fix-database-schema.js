const { Client } = require('pg')
const bcrypt = require('bcryptjs')

const client = new Client({
  connectionString: "postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
})

async function fixSchema() {
  try {
    await client.connect()
    console.log('🔧 Fixing database schema...')
    
    // Add missing columns to Product table
    console.log('\n📦 Adding missing columns to Product table...')
    try {
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS slug TEXT`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "loyaltyPoints" INTEGER DEFAULT 0`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "loyaltyLevel" TEXT DEFAULT 'bronze'`)
      await client.query(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "totalSpent" DECIMAL(10,2) DEFAULT 0`)
      console.log('✅ Product table columns added')
    } catch (error) {
      console.log('⚠️  Some Product columns might already exist:', error.message)
    }
    
    // Add missing columns to Collection table
    console.log('\n📁 Adding missing columns to Collection table...')
    try {
      await client.query(`ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS slug TEXT`)
      console.log('✅ Collection table columns added')
    } catch (error) {
      console.log('⚠️  Some Collection columns might already exist:', error.message)
    }
    
    // Add missing columns to User table
    console.log('\n👤 Adding missing columns to User table...')
    try {
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "loyaltyPoints" INTEGER DEFAULT 0`)
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "loyaltyLevel" TEXT DEFAULT 'bronze'`)
      await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalSpent" DECIMAL(10,2) DEFAULT 0`)
      console.log('✅ User table columns added')
    } catch (error) {
      console.log('⚠️  Some User columns might already exist:', error.message)
    }
    
    // Fix admin user password
    console.log('\n🔑 Fixing admin user password...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await client.query(`
      UPDATE "User" 
      SET password = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE email = 'admin@sportsnation.com'
    `, [hashedPassword])
    console.log('✅ Admin password updated')
    
    // Create some sample data
    console.log('\n🌱 Creating sample data...')
    
    // Create sample products
    const sampleProducts = [
      {
        id: 'product-1',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Air Max technology',
        price: 120.00,
        originalPrice: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
        category: 'Sneakers',
        brand: 'Nike',
        inStock: true,
        stock: 50,
        isActive: true,
        isFeatured: true,
        slug: 'nike-air-max-270'
      },
      {
        id: 'product-2',
        name: 'Adidas Ultraboost 22',
        description: 'High-performance running shoes with Boost technology',
        price: 180.00,
        originalPrice: 200.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
        category: 'Sneakers',
        brand: 'Adidas',
        inStock: true,
        stock: 30,
        isActive: true,
        isFeatured: true,
        slug: 'adidas-ultraboost-22'
      }
    ]
    
    for (const product of sampleProducts) {
      await client.query(`
        INSERT INTO "Product" (id, name, description, price, "originalPrice", image, category, brand, "inStock", stock, "isActive", "isFeatured", slug, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          "originalPrice" = EXCLUDED."originalPrice",
          image = EXCLUDED.image,
          category = EXCLUDED.category,
          brand = EXCLUDED.brand,
          "inStock" = EXCLUDED."inStock",
          stock = EXCLUDED.stock,
          "isActive" = EXCLUDED."isActive",
          "isFeatured" = EXCLUDED."isFeatured",
          slug = EXCLUDED.slug,
          "updatedAt" = CURRENT_TIMESTAMP
      `, [
        product.id, product.name, product.description, product.price, product.originalPrice,
        product.image, product.category, product.brand, product.inStock, product.stock,
        product.isActive, product.isFeatured, product.slug
      ])
    }
    console.log('✅ Sample products created')
    
    // Create sample collections
    const sampleCollections = [
      {
        id: 'collection-1',
        name: 'Featured Sneakers',
        description: 'Our best selection of premium sneakers',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        slug: 'featured-sneakers'
      },
      {
        id: 'collection-2',
        name: 'Running Shoes',
        description: 'Perfect for your daily runs and workouts',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
        slug: 'running-shoes'
      }
    ]
    
    for (const collection of sampleCollections) {
      await client.query(`
        INSERT INTO "Collection" (id, name, description, image, "isActive", "isFeatured", "sortOrder", slug, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          "isActive" = EXCLUDED."isActive",
          "isFeatured" = EXCLUDED."isFeatured",
          "sortOrder" = EXCLUDED."sortOrder",
          slug = EXCLUDED.slug,
          "updatedAt" = CURRENT_TIMESTAMP
      `, [
        collection.id, collection.name, collection.description, collection.image,
        collection.isActive, collection.isFeatured, collection.sortOrder, collection.slug
      ])
    }
    console.log('✅ Sample collections created')
    
    // Create sample banners
    const sampleBanners = [
      {
        id: 'banner-1',
        title: 'Summer Sale',
        description: 'Up to 50% off on all sneakers',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
        linkUrl: '/collections/sale',
        position: 'home_hero',
        isActive: true,
        priority: 1
      },
      {
        id: 'banner-2',
        title: 'New Arrivals',
        description: 'Check out our latest collection',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
        linkUrl: '/collections/new',
        position: 'home_top',
        isActive: true,
        priority: 2
      }
    ]
    
    for (const banner of sampleBanners) {
      await client.query(`
        INSERT INTO "Banner" (id, title, description, image, "linkUrl", position, "isActive", priority, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          "linkUrl" = EXCLUDED."linkUrl",
          position = EXCLUDED.position,
          "isActive" = EXCLUDED."isActive",
          priority = EXCLUDED.priority,
          "updatedAt" = CURRENT_TIMESTAMP
      `, [
        banner.id, banner.title, banner.description, banner.image,
        banner.linkUrl, banner.position, banner.isActive, banner.priority
      ])
    }
    console.log('✅ Sample banners created')
    
    console.log('\n🎉 Database schema fixed and sample data created!')
    console.log('🔑 Admin login: admin@sportsnation.com / admin123')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

fixSchema()

