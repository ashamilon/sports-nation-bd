import { Metadata } from 'next'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Crown, Star, Gift, TrendingUp, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Loyalty Program Demo | Sports Nation BD',
  description: 'See how our loyalty program works with 5 levels of benefits',
}

export default function LoyaltyDemoPage() {
  // Demo data showing different loyalty levels
  const loyaltyLevels = [
    {
      level: 'bronze',
      name: 'Bronze',
      displayName: 'Bronze Member',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: '🥉',
      discount: 50,
      description: 'Welcome to our loyalty program!',
      benefits: ['50৳ discount on first order', 'Access to exclusive deals'],
      requirements: 'New member',
      nextLevel: 'Silver (10 orders in 3 months)'
    },
    {
      level: 'silver',
      name: 'Silver',
      displayName: 'Silver Member',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      icon: '🥈',
      discount: 150,
      description: 'You\'re building your loyalty!',
      benefits: ['150৳ discount on every order', 'Priority customer support', 'Early access to sales'],
      requirements: '10 orders in 3 months',
      nextLevel: 'Gold (30 orders in 3 months)'
    },
    {
      level: 'gold',
      name: 'Gold',
      displayName: 'Gold Member',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: '🥇',
      discount: 220,
      description: 'You\'re a premium customer!',
      benefits: ['220৳ discount on every order', 'Free express shipping', 'Personal shopping assistant'],
      requirements: '30 orders in 3 months',
      nextLevel: 'Platinum (50 orders in 3 months)'
    },
    {
      level: 'platinum',
      name: 'Platinum',
      displayName: 'Platinum VIP',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: '💎',
      discount: 400,
      description: 'You\'re our most valued customer!',
      benefits: ['400৳ discount on every order', 'VIP customer support', 'Exclusive events access', 'Custom product requests'],
      requirements: '50 orders in 3 months',
      nextLevel: 'Maximum level achieved!'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Loyalty Program Demo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our 4-level loyalty system works. Earn rewards with every purchase and unlock exclusive benefits!
            </p>
          </div>

          {/* Program Overview */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <div className="text-center mb-8">
              <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Start at Bronze level and advance through Silver, Gold, and Platinum by completing orders.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
                <p className="text-muted-foreground">Complete orders to advance through levels</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Rewards</h3>
                <p className="text-muted-foreground">Unlock bigger discounts at higher levels</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Stay Active</h3>
                <p className="text-muted-foreground">Maintain your level with regular orders</p>
              </div>
            </div>
          </div>

          {/* Loyalty Levels */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Loyalty Levels</h2>
            
            {loyaltyLevels.map((level, index) => (
              <Card key={level.level} className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${level.bgColor} rounded-full flex items-center justify-center text-2xl`}>
                        {level.icon}
                      </div>
                      <div>
                        <CardTitle className={`text-2xl ${level.color}`}>
                          {level.displayName}
                        </CardTitle>
                        <p className="text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {level.discount}৳ Discount
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {level.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Requirements</h4>
                      <p className="text-sm text-muted-foreground mb-4">{level.requirements}</p>
                      <h4 className="font-semibold mb-3">Next Level</h4>
                      <p className="text-sm text-muted-foreground">{level.nextLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Notes */}
          <div className="glass-card p-8 rounded-2xl mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Important Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Regional Availability
                </h4>
                <p className="text-sm text-muted-foreground">
                  The loyalty program is currently available only for customers in Bangladesh.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Order Requirements
                </h4>
                <p className="text-sm text-muted-foreground">
                  All orders must be worth at least 1,000৳ to count towards loyalty progression.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning Rewards?</h3>
            <p className="text-muted-foreground mb-6">
              Sign up today and start your journey to Platinum VIP status!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/signup" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Sign Up Now
              </a>
              <a 
                href="/" 
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                Start Shopping
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
