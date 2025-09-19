const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Jerseys',
    slug: 'jerseys',
    description: 'Football jerseys and sports apparel',
    image: '/api/placeholder/300/300'
  },
  {
    name: 'Sneakers',
    slug: 'sneakers', 
    description: 'Sports shoes and sneakers',
    image: '/api/placeholder/300/300'
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    description: 'Sports shorts and athletic wear',
    image: '/api/placeholder/300/300'
  },
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Sports watches and fitness trackers',
    image: '/api/placeholder/300/300'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Sports accessories and equipment',
    image: '/api/placeholder/300/300'
  }
]

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...')
    
    for (const category of categories) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Created category: ${category.name}`)
    }
    
    console.log('🎉 Categories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()
