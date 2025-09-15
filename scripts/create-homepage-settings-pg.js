const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://postgres.kebgbomwiyfumhrslfgg:Limon.123!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
})

async function createHomepageSettings() {
  try {
    await client.connect()
    console.log('🌱 Connected to database')
    
    // Clear existing settings
    await client.query('DELETE FROM "HomepageSettings"')
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
      const query = `
        INSERT INTO "HomepageSettings" (
          "sectionKey", 
          "sectionName", 
          "isVisible", 
          "sortOrder", 
          "metadata", 
          "createdAt", 
          "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id
      `
      
      const values = [
        section.sectionKey,
        section.sectionName,
        section.isVisible,
        section.sortOrder,
        section.metadata
      ]
      
      const result = await client.query(query, values)
      console.log(`✅ Created section: ${section.sectionName} (ID: ${result.rows[0].id})`)
    }
    
    console.log('🎉 Homepage settings created successfully!')
    console.log(`📊 Created ${sections.length} homepage sections`)
    
  } catch (error) {
    console.error('❌ Error creating homepage settings:', error)
  } finally {
    await client.end()
  }
}

createHomepageSettings()
