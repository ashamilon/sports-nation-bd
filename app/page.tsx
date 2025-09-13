import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import HeroSection from '@/components/hero-section'
import FeaturedProducts from '@/components/featured-products'
import CategoriesSection from '@/components/categories-section'
import Footer from '@/components/footer'
import DynamicHome from '@/components/dynamic-home'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DynamicHome />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
