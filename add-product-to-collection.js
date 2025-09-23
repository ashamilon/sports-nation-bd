const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProductToCollection() {
  try {
    // Get the Limited Time Offer collection
    const collection = await prisma.collection.findFirst({
      where: {
        slug: 'limited-time-offer'
      }
    })

    if (!collection) {
      console.log('Limited Time Offer collection not found')
      return
    }

    console.log('Found collection:', collection.name, 'with ID:', collection.id)

    // Get the first product
    const product = await prisma.product.findFirst()

    if (!product) {
      console.log('No products found')
      return
    }

    console.log('Found product:', product.name, 'with ID:', product.id)

    // Add the product to the collection
    const result = await prisma.collectionProduct.create({
      data: {
        collectionId: collection.id,
        productId: product.id
      }
    })

    console.log('Successfully added product to collection:', result)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addProductToCollection()
