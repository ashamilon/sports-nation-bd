import { Metadata } from 'next'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import SimpleLoyaltyStatus from '@/components/simple-loyalty-status'

export const metadata: Metadata = {
  title: 'Loyalty Status | Sports Nation BD',
  description: 'Check your loyalty level and benefits',
}

export default function LoyaltyStatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Your Loyalty Status</h1>
            <p className="text-lg text-muted-foreground">
              Track your progress and unlock amazing benefits
            </p>
          </div>

          {/* Loyalty Status Component */}
          <div className="mb-8">
            <SimpleLoyaltyStatus />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it Works */}
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Start at Iron level with 50৳ first order bonus</li>
                <li>• Complete orders to advance through levels</li>
                <li>• Higher levels = bigger discounts</li>
                <li>• Maintain activity to keep your level</li>
                <li>• Available only for Bangladesh customers</li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Level:</span>
                  <span className="font-semibold">Iron</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-semibold">৳0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Level:</span>
                  <span className="font-semibold">Bronze (10 orders)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Shopping to Earn Rewards
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
