import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import CollectionsDisplay from '@/components/collections-display'

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Collections</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our curated collections of premium sports gear and accessories
          </p>
        </div>

        <CollectionsDisplay
          parentId="null"
          showProducts={true}
        />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

