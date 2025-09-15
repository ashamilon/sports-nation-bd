const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createHomepageSettings() {
  try {
    console.log('🌱 Creating homepage settings...')
    
    // Clear existing settings
    await prisma.homepageSettings.deleteMany()
    console.log('✅ Cleared existing homepage settings')
    
    // Create homepage sections
    const sections = [
      {
        sectionKey: 'banner',
        sectionName: 'Banner Slideshow',
        isVisible: true,
        sortOrder: 1,
        metadata: JSON.stringify({
          description: 'Hero banner with promotional content',
          component: 'BannerSlideshow'
        })
      },
      {
        sectionKey: 'hero',
        sectionName: 'Hero Section',
        isVisible: true,
        sortOrder: 2,
        metadata: JSON.stringify({
          description: 'Main hero section with call-to-action',
          component: 'HeroSection'
        })
      },
      {
        sectionKey: 'categories',
        sectionName: 'Categories Section',
        isVisible: true,
        sortOrder: 3,
        metadata: JSON.stringify({
          description: 'Product categories showcase',
          component: 'CategoriesSection'
        })
      },
      {
        sectionKey: 'collections',
        sectionName: 'Collections Section',
        isVisible: true,
        sortOrder: 4,
        metadata: JSON.stringify({
          description: 'Featured product collections',
          component: 'CollectionsSection'
        })
      },
      {
        sectionKey: 'featured-products',
        sectionName: 'Featured Products',
        isVisible: true,
        sortOrder: 5,
        metadata: JSON.stringify({
          description: 'Featured products showcase',
          component: 'FeaturedProducts'
        })
      },
      {
        sectionKey: 'countdown',
        sectionName: 'Countdown Timer',
        isVisible: true,
        sortOrder: 6,
        metadata: JSON.stringify({
          description: 'Promotional countdown timer',
          component: 'CountdownTimer'
        })
      }
    ]
    
    // Insert sections
    for (const section of sections) {
      await prisma.homepageSettings.create({
        data: section
      })
      console.log(`✅ Created section: ${section.sectionName}`)
    }
    
    console.log('🎉 Homepage settings created successfully!')
    console.log(`📊 Created ${sections.length} homepage sections`)
    
  } catch (error) {
    console.error('❌ Error creating homepage settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createHomepageSettings()
