import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import CategoryProducts from '@/components/category-products'
import Breadcrumb from '@/components/breadcrumb'
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
      other_Category: true,
      Product: {
        where: {
          isActive: true
        },
        include: {
          ProductVariant: true,
          Review: {
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
  const productsWithRating = category.Product.map(product => {
    const avgRating = product.Review.length > 0 
      ? product.Review.reduce((sum, review) => sum + review.rating, 0) / product.Review.length
      : 0

    return {
      ...product,
      images: product.images || [],
      averageRating: avgRating,
      reviewCount: product.Review.length,
      comparePrice: product.comparePrice || undefined,
      weight: product.weight || undefined,
      dimensions: product.dimensions || undefined,
      nameNumberPrice: product.nameNumberPrice || undefined,
      variants: product.ProductVariant.map(variant => ({
        ...variant,
        price: variant.price || undefined
      }))
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Products', href: '/products' },
            { label: category.name }
          ]}
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        <CategoryProducts 
          category={{
            ...category,
            children: category.other_Category,
            description: category.description || undefined
          }} 
          products={productsWithRating}
        />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
