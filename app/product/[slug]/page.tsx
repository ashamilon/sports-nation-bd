import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import ProductDetails from '@/components/product-details'
import { prisma } from '@/lib/prisma'

interface ProductPageProps {
  params: {
    slug: string
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
      category: true,
      variants: true,
      badges: {
        where: {
          isActive: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Calculate average rating
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const productWithRating = {
    ...product,
    images: JSON.parse(product.images || '[]'),
    averageRating,
    reviewCount: product.reviews.length
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetails product={productWithRating} />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
