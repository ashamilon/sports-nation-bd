import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sportsnationbd.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@sportsnationbd.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+880 1234 567890'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create categories
  const watchesCategory = await prisma.category.upsert({
    where: { slug: 'watches' },
    update: {},
    create: {
      name: 'Naviforce Watches',
      slug: 'watches',
      description: 'Premium sports watches and timepieces',
      image: '/categories/watches.jpg'
    }
  })

  const jerseysCategory = await prisma.category.upsert({
    where: { slug: 'jerseys' },
    update: {},
    create: {
      name: 'Club Jerseys',
      slug: 'jerseys',
      description: 'Official and replica club jerseys',
      image: '/categories/jerseys.jpg'
    }
  })

  const sneakersCategory = await prisma.category.upsert({
    where: { slug: 'sneakers' },
    update: {},
    create: {
      name: 'Premium Sneakers',
      slug: 'sneakers',
      description: 'Top brand sneakers and athletic shoes',
      image: '/categories/sneakers.jpg'
    }
  })

  const shortsCategory = await prisma.category.upsert({
    where: { slug: 'shorts' },
    update: {},
    create: {
      name: 'Club Shorts',
      slug: 'shorts',
      description: 'Matching shorts for your jerseys',
      image: '/categories/shorts.jpg'
    }
  })

  const customCategory = await prisma.category.upsert({
    where: { slug: 'custom' },
    update: {},
    create: {
      name: 'Custom Jerseys',
      slug: 'custom',
      description: 'Custom made jerseys (minimum 11 pieces)',
      image: '/categories/custom.jpg'
    }
  })

  const badgesCategory = await prisma.category.upsert({
    where: { slug: 'badges' },
    update: {},
    create: {
      name: 'Premium Badges',
      slug: 'badges',
      description: 'League, UCL and FIFA badges',
      image: '/categories/badges.jpg'
    }
  })

  // Create sample products
  const realMadridJersey = await prisma.product.upsert({
    where: { slug: 'real-madrid-home-jersey-2024' },
    update: {},
    create: {
      name: 'Real Madrid Home Jersey 2024',
      slug: 'real-madrid-home-jersey-2024',
      description: 'Official Real Madrid home jersey for the 2024 season. Available in fan and player versions with custom name and number options.',
      price: 2500,
      comparePrice: 3000,
      sku: 'RM-HOME-2024',
      stock: 50,
      images: JSON.stringify([
        '/api/placeholder/300/400',
        '/api/placeholder/300/400',
        '/api/placeholder/300/400'
      ]),
      isActive: true,
      isFeatured: true,
      categoryId: jerseysCategory.id,
      allowNameNumber: true,
      nameNumberPrice: 250
    }
  })

  const naviforceWatch = await prisma.product.upsert({
    where: { slug: 'naviforce-nf9027-sports-watch' },
    update: {},
    create: {
      name: 'Naviforce NF9027 Sports Watch',
      slug: 'naviforce-nf9027-sports-watch',
      description: 'Premium sports watch with chronograph, water resistance, and LED display. Perfect for athletes and sports enthusiasts.',
      price: 4500,
      comparePrice: 5500,
      sku: 'NF-9027',
      stock: 25,
      images: JSON.stringify([
        '/api/placeholder/300/400',
        '/api/placeholder/300/400',
        '/api/placeholder/300/400'
      ]),
      isActive: true,
      isFeatured: true,
      categoryId: watchesCategory.id
    }
  })

  const barcelonaJersey = await prisma.product.upsert({
    where: { slug: 'barcelona-away-jersey-2024' },
    update: {},
    create: {
      name: 'Barcelona Away Jersey 2024',
      slug: 'barcelona-away-jersey-2024',
      description: 'Official Barcelona away jersey for the 2024 season. Available in fan and player versions with custom name and number options.',
      price: 2400,
      comparePrice: 2900,
      sku: 'BAR-AWAY-2024',
      stock: 45,
      images: JSON.stringify([
        '/api/placeholder/300/400',
        '/api/placeholder/300/400',
        '/api/placeholder/300/400'
      ]),
      isActive: true,
      isFeatured: true,
      categoryId: jerseysCategory.id,
      allowNameNumber: true,
      nameNumberPrice: 250
    }
  })

  const nikeAirMax = await prisma.product.upsert({
    where: { slug: 'nike-air-max-270' },
    update: {},
    create: {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Comfortable and stylish sneakers with Air Max technology. Perfect for daily wear and light sports activities.',
      price: 12000,
      comparePrice: 15000,
      sku: 'NIKE-AM270',
      stock: 30,
      images: JSON.stringify([
        '/api/placeholder/300/400',
        '/api/placeholder/300/400',
        '/api/placeholder/300/400'
      ]),
      isActive: true,
      isFeatured: true,
      categoryId: sneakersCategory.id
    }
  })

  // Create product variants
  await prisma.productVariant.createMany({
    data: [
      // Real Madrid Jersey variants
      {
        name: 'Version',
        value: 'Fan Version',
        price: 2500,
        stock: 30,
        productId: realMadridJersey.id
      },
      {
        name: 'Version',
        value: 'Player Version',
        price: 3500,
        stock: 20,
        productId: realMadridJersey.id
      },
      {
        name: 'Size',
        value: 'S',
        stock: 10,
        productId: realMadridJersey.id
      },
      {
        name: 'Size',
        value: 'M',
        stock: 15,
        productId: realMadridJersey.id
      },
      {
        name: 'Size',
        value: 'L',
        stock: 15,
        productId: realMadridJersey.id
      },
      {
        name: 'Size',
        value: 'XL',
        stock: 10,
        productId: realMadridJersey.id
      },
      // Naviforce Watch variants
      {
        name: 'Color',
        value: 'Black',
        price: 4500,
        stock: 15,
        productId: naviforceWatch.id
      },
      {
        name: 'Color',
        value: 'Blue',
        price: 4500,
        stock: 10,
        productId: naviforceWatch.id
      },
      // Barcelona Jersey variants
      {
        name: 'Version',
        value: 'Fan Version',
        price: 2400,
        stock: 25,
        productId: barcelonaJersey.id
      },
      {
        name: 'Version',
        value: 'Player Version',
        price: 3400,
        stock: 20,
        productId: barcelonaJersey.id
      },
      {
        name: 'Size',
        value: 'S',
        stock: 8,
        productId: barcelonaJersey.id
      },
      {
        name: 'Size',
        value: 'M',
        stock: 12,
        productId: barcelonaJersey.id
      },
      {
        name: 'Size',
        value: 'L',
        stock: 15,
        productId: barcelonaJersey.id
      },
      {
        name: 'Size',
        value: 'XL',
        stock: 10,
        productId: barcelonaJersey.id
      },
      // Nike Air Max variants
      {
        name: 'Color',
        value: 'White/Black',
        price: 12000,
        stock: 15,
        productId: nikeAirMax.id
      },
      {
        name: 'Color',
        value: 'Black/White',
        price: 12000,
        stock: 15,
        productId: nikeAirMax.id
      },
      {
        name: 'Size',
        value: '8',
        stock: 5,
        productId: nikeAirMax.id
      },
      {
        name: 'Size',
        value: '9',
        stock: 8,
        productId: nikeAirMax.id
      },
      {
        name: 'Size',
        value: '10',
        stock: 10,
        productId: nikeAirMax.id
      },
      {
        name: 'Size',
        value: '11',
        stock: 7,
        productId: nikeAirMax.id
      }
    ]
  })

  // Create premium badges for jerseys
  const realMadridBadges = await prisma.productBadge.createMany({
    data: [
      {
        name: 'UCL Badge',
        description: 'UEFA Champions League badge',
        price: 150,
        image: '/api/placeholder/50/50',
        productId: realMadridJersey.id
      },
      {
        name: 'La Liga Badge',
        description: 'Spanish La Liga badge',
        price: 100,
        image: '/api/placeholder/50/50',
        productId: realMadridJersey.id
      },
      {
        name: 'Club World Cup Badge',
        description: 'FIFA Club World Cup badge',
        price: 200,
        image: '/api/placeholder/50/50',
        productId: realMadridJersey.id
      }
    ]
  })

  const barcelonaBadges = await prisma.productBadge.createMany({
    data: [
      {
        name: 'UCL Badge',
        description: 'UEFA Champions League badge',
        price: 150,
        image: '/api/placeholder/50/50',
        productId: barcelonaJersey.id
      },
      {
        name: 'La Liga Badge',
        description: 'Spanish La Liga badge',
        price: 100,
        image: '/api/placeholder/50/50',
        productId: barcelonaJersey.id
      },
      {
        name: 'Copa del Rey Badge',
        description: 'Spanish Copa del Rey badge',
        price: 120,
        image: '/api/placeholder/50/50',
        productId: barcelonaJersey.id
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
