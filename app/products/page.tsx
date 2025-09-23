import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import ProductsGrid from '@/components/products-grid'
import Breadcrumb from '@/components/breadcrumb'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'All Products' }
          ]}
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium sports gear
          </p>
        </div>
        <ProductsGrid />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
