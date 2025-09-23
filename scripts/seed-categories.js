const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Naviforce Watches',
    slug: 'watches',
    description: 'Premium timepieces for champions',
    image: '/images/categories/watches.jpg'
  },
  {
    name: 'Club Jerseys',
    slug: 'jerseys',
    description: 'Fan & Player versions available',
    image: '/images/categories/jerseys.jpg'
  },
  {
    name: 'Premium Sneakers',
    slug: 'sneakers',
    description: 'Top brands & latest models',
    image: '/images/categories/sneakers.jpg'
  },
  {
    name: 'Club Shorts',
    slug: 'shorts',
    description: 'Match your jersey perfectly',
    image: '/images/categories/shorts.jpg'
  },
  {
    name: 'Premium Badges',
    slug: 'badges',
    description: 'League, UCL & FIFA badges',
    image: '/images/categories/badges.jpg'
  }
]

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...')
    
    for (const category of categories) {
      const id = `cat_${category.slug}_${Date.now()}`
      
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          image: category.image,
          updatedAt: new Date()
        },
        create: {
          id,
          ...category,
          updatedAt: new Date()
        }
      })
      
      console.log(`✅ Upserted category: ${category.name}`)
    }
    
    console.log('🎉 Categories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()