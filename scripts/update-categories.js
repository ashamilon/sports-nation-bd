const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Watch',
    slug: 'watch',
    description: 'Premium timepieces for champions',
    image: '/images/categories/watches.jpg'
  },
  {
    name: 'Jersey',
    slug: 'jersey',
    description: 'Fan & Player versions available',
    image: '/images/categories/jerseys.jpg'
  },
  {
    name: 'Sneaker',
    slug: 'sneaker',
    description: 'Top brands & latest models',
    image: '/images/categories/sneakers.jpg'
  },
  {
    name: 'Short',
    slug: 'short',
    description: 'Match your jersey perfectly',
    image: '/images/categories/shorts.jpg'
  },
  {
    name: 'Custom Jersey',
    slug: 'custom-jersey',
    description: 'Minimum 11 pieces order',
    image: '/images/categories/custom-jerseys.jpg'
  },
  {
    name: 'Badge',
    slug: 'badge',
    description: 'League, UCL & FIFA badges',
    image: '/images/categories/badges.jpg'
  }
]

async function updateCategories() {
  try {
    console.log('🔄 Updating categories...')
    
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
      
      console.log(`✅ Upserted category: ${category.name} (${category.slug})`)
    }
    
    console.log('🎉 Categories updated successfully!')
  } catch (error) {
    console.error('❌ Error updating categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCategories()
