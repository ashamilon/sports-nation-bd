import { Metadata } from 'next'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import { Crown, Star, Gift, TrendingUp, Clock, MapPin, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Loyalty Program Terms & Conditions | Sports Nation BD',
  description: 'Terms and conditions for our loyalty program with 5 levels of benefits',
}

export default function LoyaltyTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Loyalty Program Terms & Conditions</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Complete terms and conditions for our 5-level loyalty program
            </p>
          </div>

          {/* Eligibility */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Eligibility</h2>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              This loyalty program is exclusively available for customers located in Bangladesh. 
              Users from other countries are not eligible to participate in this program.
            </p>
          </div>

          {/* Program Overview */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Program Overview
              </h2>
              <p className="text-muted-foreground mb-6">
                Our loyalty program consists of 5 levels, each offering increasing benefits and discounts. 
                All levels require a minimum order value of 1000৳ to be eligible for discounts.
              </p>
            </div>

            {/* Level Details */}
            <div className="space-y-6">
              {/* Iron Level */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🥉</span>
                  <h3 className="text-xl font-semibold" style={{ color: '#6B7280' }}>Iron Level</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 50৳ discount on first order</li>
                      <li>• Entry level benefits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Promotion Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 10 orders in 3 months</li>
                      <li>• Minimum 1000৳ per order</li>
                      <li>• Total spending over 1000৳</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bronze Level */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🥉</span>
                  <h3 className="text-xl font-semibold" style={{ color: '#CD7F32' }}>Bronze Level</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 150৳ discount on every order</li>
                      <li>• Enhanced customer support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Minimum 2 orders per month</li>
                      <li>• 1 month grace period</li>
                      <li>• 30 orders in 3 months to promote</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Silver Level */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🥈</span>
                  <h3 className="text-xl font-semibold" style={{ color: '#C0C0C0' }}>Silver Level</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 180৳ discount on every order</li>
                      <li>• Priority shipping</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Minimum 3 orders per month</li>
                      <li>• 1 month grace period</li>
                      <li>• 50 orders in 3 months to promote</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gold Level */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🥇</span>
                  <h3 className="text-xl font-semibold" style={{ color: '#FFD700' }}>Gold Level</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 220৳ discount on every order</li>
                      <li>• Exclusive access to new products</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Minimum 5 orders per month</li>
                      <li>• 1 month grace period</li>
                      <li>• 50 orders in 3 months to promote</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Platinum Level */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💎</span>
                  <h3 className="text-xl font-semibold" style={{ color: '#E5E4E2' }}>Platinum Level</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 400৳ discount per month (once per month)</li>
                      <li>• VIP customer support</li>
                      <li>• Early access to sales</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Minimum 8 orders per month</li>
                      <li>• 1 month grace period</li>
                      <li>• Highest tier - no further promotion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Terms */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100">Important Terms</h2>
              </div>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                <li>• All discounts require a minimum order value of 1000৳</li>
                <li>• Level changes are automatic based on your order history</li>
                <li>• If promotion requirements are not met within the specified period, the count resets to zero</li>
                <li>• Demotion occurs if minimum monthly order requirements are not met</li>
                <li>• Platinum level discount can only be used once per month</li>
                <li>• First order discount is only available once per account</li>
                <li>• This program is valid only for customers in Bangladesh</li>
                <li>• Sports Nation BD reserves the right to modify these terms at any time</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Questions about our Loyalty Program?</h3>
              <p className="text-muted-foreground mb-4">
                Contact our customer support team for any questions or clarifications.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Gift className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

