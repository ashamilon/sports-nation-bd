import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import CollectionsDisplay from '@/components/collections-display'
import { prisma } from '@/lib/prisma'

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  
  const collection = await prisma.collection.findUnique({
    where: {
      slug,
      isActive: true
    },
    include: {
      parent: true,
      children: {
        where: {
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      },
      _count: {
        select: {
          children: true,
          products: true
        }
      }
    }
  })

  if (!collection) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {collection.parent && (
              <>
                <a 
                  href={`/collections/${collection.parent.slug}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {collection.parent.name}
                </a>
                <span className="text-muted-foreground">/</span>
              </>
            )}
            <h1 className="text-3xl font-bold">{collection.name}</h1>
          </div>
          
          {collection.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {collection.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{collection._count.products} products</span>
            {collection._count.children > 0 && (
              <span>{collection._count.children} sub-collections</span>
            )}
          </div>
        </div>

        {/* Sub-collections */}
        {collection.children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Sub-collections</h2>
            <CollectionsDisplay
              parentId={collection.id}
              showProducts={false}
              className="mb-8"
            />
          </div>
        )}

        {/* Collection Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <CollectionsDisplay
            parentId={collection.id}
            showProducts={true}
          />
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

