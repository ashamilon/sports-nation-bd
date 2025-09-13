import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import CategoryProducts from '@/components/category-products'
import { prisma } from '@/lib/prisma'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: {
      slug
    },
    include: {
      children: true,
      products: {
        where: {
          isActive: true
        },
        include: {
          variants: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  // Calculate average rating for each product
  const productsWithRating = category.products.map(product => {
    const avgRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
      averageRating: avgRating,
      reviewCount: product.reviews.length
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        <CategoryProducts 
          category={category} 
          products={productsWithRating}
        />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
