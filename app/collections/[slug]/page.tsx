import { notFound } from 'next/navigation'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import CollectionProducts from '@/components/collection-products'
import SubCollectionsDisplay from '@/components/sub-collections-display'
import CollectionCountdownBanner from '@/components/collection-countdown-banner'
import Breadcrumb from '@/components/breadcrumb'
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
      Collection: true, // parent relationship
      other_Collection: {
        where: {
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      },
      _count: {
        select: {
          other_Collection: true,
          CollectionProduct: true
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
        <Breadcrumb 
          items={[
            { label: 'Collections', href: '/collections' },
            ...(collection.Collection ? [{ label: collection.Collection.name, href: `/collections/${collection.Collection.slug}` }] : []),
            { label: collection.name }
          ]}
          className="mb-6"
        />
        {/* Countdown Banner for Limited Time Offer */}
        {collection.slug === 'limited-time-offer' && (
          <CollectionCountdownBanner 
            collectionName={collection.name}
            productCount={collection._count.CollectionProduct}
          />
        )}

        {/* Collection Header - Only show for non-limited-time-offer collections */}
        {collection.slug !== 'limited-time-offer' && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {collection.Collection && (
                <>
                  <a 
                    href={`/collections/${collection.Collection.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {collection.Collection.name}
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
              <span>{collection._count.CollectionProduct} products</span>
              {collection._count.other_Collection > 0 && (
                <span>{collection._count.other_Collection} sub-collections</span>
              )}
            </div>
          </div>
        )}

        {/* Collection Info for Limited Time Offer */}
        {collection.slug === 'limited-time-offer' && (
          <div className="mb-8">
            {collection.description && (
              <p className="text-lg text-muted-foreground max-w-3xl mb-4">
                {collection.description}
              </p>
            )}
            
          </div>
        )}

        {/* Sub-collections */}
        {collection.other_Collection.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Sub-collections</h2>
            <SubCollectionsDisplay
              parentId={collection.id}
              className="mb-8"
            />
          </div>
        )}

        {/* Collection Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <CollectionProducts collectionId={collection.id} />
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

