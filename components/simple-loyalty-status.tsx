import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Crown, Star, Gift, TrendingUp, Clock, MapPin } from 'lucide-react'

export default async function SimpleLoyaltyStatus() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Join Our Loyalty Program</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to track your loyalty status and unlock exclusive benefits!
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🥉 Bronze Level: 50৳ discount on first order</p>
              <p>🥈 Silver Level: 150৳ discount on every order</p>
              <p>🥇 Gold Level: 220৳ discount on every order</p>
              <p>💎 Platinum Level: 400৳ discount on every order</p>
            </div>
            <div className="mt-6">
              <a 
                href="/auth/signin" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign In to Get Started
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  try {
    // Get user data directly from database with error handling
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        loyaltyLevel: true,
        createdAt: true
      }
    }).catch((dbError) => {
      console.error('Database error in loyalty status:', dbError)
      return null
    })

    if (!user) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Loyalty Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">User not found</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Check if user is eligible (Bangladesh only)
    if (user.country !== 'Bangladesh') {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Loyalty Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Loyalty program is currently available only for customers in Bangladesh.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Get real order data for loyalty calculation
    const orderStats = await prisma.order.aggregate({
      where: { userId: user.id },
      _count: { id: true },
      _sum: { total: true }
    }).catch(() => ({ _count: { id: 0 }, _sum: { total: 0 } }))

    const currentLevel = user.loyaltyLevel || 'bronze'
    const totalOrders = orderStats._count.id || 0
    const totalSpent = orderStats._sum.total || 0

    // Define loyalty levels
    const loyaltyLevels = {
      bronze: {
        name: 'Bronze',
        icon: '🥉',
        color: '#CD7F32',
        discount: 50,
        nextLevel: 'Silver',
        nextLevelOrders: 10
      },
      silver: {
        name: 'Silver',
        icon: '🥈',
        color: '#C0C0C0',
        discount: 150,
        nextLevel: 'Gold',
        nextLevelOrders: 30
      },
      gold: {
        name: 'Gold',
        icon: '🥇',
        color: '#FFD700',
        discount: 220,
        nextLevel: 'Platinum',
        nextLevelOrders: 50
      },
      platinum: {
        name: 'Platinum',
        icon: '💎',
        color: '#E5E4E2',
        discount: 400,
        nextLevel: null,
        nextLevelOrders: null
      }
    }

    const currentConfig = loyaltyLevels[currentLevel as keyof typeof loyaltyLevels]
    const nextConfig = currentConfig.nextLevel ? loyaltyLevels[currentConfig.nextLevel.toLowerCase() as keyof typeof loyaltyLevels] : null

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Level */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4">
                <span className="text-3xl">{currentConfig.icon}</span>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: currentConfig.color }}>
                    {currentConfig.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentConfig.discount}৳ discount {currentLevel === 'bronze' ? 'on first order' : 'on every order'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress to Next Level */}
            {nextConfig && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress to {nextConfig.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {totalOrders}/{currentConfig.nextLevelOrders} orders
                  </span>
                </div>
                <Progress 
                  value={(totalOrders / currentConfig.nextLevelOrders!) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Complete {currentConfig.nextLevelOrders} orders in 3 months to advance
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                <div className="text-xs text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">৳{totalSpent.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h5 className="font-semibold flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Your Benefits
              </h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    {currentConfig.discount}৳ discount {currentLevel === 'bronze' ? 'on first order' : 'on every order'}
                  </span>
                </div>
                {currentLevel === 'platinum' && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">VIP customer support</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Level Info */}
            {nextConfig && (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  Complete {currentConfig.nextLevelOrders} orders in 3 months to reach {nextConfig.name} level and get {nextConfig.discount}৳ discount on every order!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error loading loyalty status:', error)
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Loyalty Status Unavailable</h3>
            <p className="text-muted-foreground mb-4">
              We're having trouble loading your loyalty information right now.
            </p>
            <p className="text-xs text-muted-foreground">
              This is usually temporary. Please try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

