import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import ProductDetails from '@/components/product-details'
import Breadcrumb from '@/components/breadcrumb'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getBadgesFromIds(badgeIds: string[]) {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'badges.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const badgesData = JSON.parse(fileContents)
    const allBadges = badgesData.badges || []
    
    // Filter badges by IDs and only return active ones
    return allBadges.filter((badge: any) => 
      badgeIds.includes(badge.id) && badge.isActive
    )
  } catch (error) {
    console.error('Error fetching badges:', error)
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
      isActive: true
    },
    include: {
      Category: true,
      ProductVariant: true,
      Review: {
        include: {
          User: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      CollectionProduct: {
        include: {
          Collection: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Calculate average rating
  const reviews = product.Review || []
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const productWithRating = {
    ...product,
    images: product.images || [],
    averageRating,
    reviewCount: reviews.length,
    comparePrice: product.comparePrice || undefined,
    weight: product.weight || undefined,
    dimensions: product.dimensions || undefined,
    nameNumberPrice: product.nameNumberPrice || undefined,
    variants: (product.ProductVariant || []).map(variant => ({
      id: variant.id,
      name: variant.name || undefined,
      value: variant.value || undefined,
      price: variant.price || undefined,
      fabricType: variant.fabricType || undefined,
      sizes: variant.sizes || undefined
    })),
    category: product.Category ? {
      ...product.Category,
      description: product.Category.description || undefined,
      image: product.Category.image || undefined
    } : {
      name: 'Unknown Category',
      slug: 'unknown',
      description: undefined,
      image: undefined
    },
    reviews: reviews.map(review => ({
      ...review,
      comment: review.comment || undefined,
      user: {
        name: review.User?.name || undefined,
        image: review.User?.image || undefined
      },
      createdAt: review.createdAt.toISOString()
    })),
    badges: product.selectedBadges ? await getBadgesFromIds(JSON.parse(product.selectedBadges)) : [],
    collections: product.CollectionProduct?.map(cp => cp.Collection) || []
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb 
            items={[
              { label: 'Products', href: '/products' },
              ...(product.Category ? [{ label: product.Category.name, href: `/category/${product.Category.slug}` }] : []),
              { label: product.name }
            ]}
            className="mb-6"
          />
        </div>
        <ProductDetails product={productWithRating} />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
