const { Client } = require('pg');

async function createMenuConfigTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🌱 Connected to database');
    await client.connect();

    // Create MenuConfig table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "MenuConfig" (
        "id" TEXT NOT NULL,
        "menuType" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "collections" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "metadata" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "MenuConfig_pkey" PRIMARY KEY ("id")
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ MenuConfig table created successfully');

    // Create some default menu configurations
    const defaultMenus = [
      {
        menuType: 'header',
        title: 'Sports Collection',
        collections: JSON.stringify(['watches_collection', 'sneakers_collection', 'jerseys_collection']),
        isActive: true,
        sortOrder: 1,
        metadata: JSON.stringify({
          description: 'Main sports collection dropdown',
          icon: 'sports'
        })
      },
      {
        menuType: 'header',
        title: 'Buy Your Dream Here',
        collections: JSON.stringify(['watches_collection', 'sneakers_collection']),
        isActive: true,
        sortOrder: 2,
        metadata: JSON.stringify({
          description: 'Premium sports gear collection',
          icon: 'premium'
        })
      }
    ];

    // Clear existing menu configs
    await client.query('DELETE FROM "MenuConfig"');
    console.log('✅ Cleared existing menu configurations');

    // Insert default menu configurations
    for (const menu of defaultMenus) {
      const result = await client.query(
        `INSERT INTO "MenuConfig" (
          "id", "menuType", "title", "collections", "isActive", "sortOrder", "metadata", "createdAt", "updatedAt"
        ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id`,
        [menu.menuType, menu.title, menu.collections, menu.isActive, menu.sortOrder, menu.metadata]
      );
      console.log(`✅ Created menu: ${menu.title} (ID: ${result.rows[0].id})`);
    }

    console.log('🎉 Menu configuration setup completed successfully!');

  } catch (error) {
    console.error('❌ Error creating menu config table:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createMenuConfigTable();
