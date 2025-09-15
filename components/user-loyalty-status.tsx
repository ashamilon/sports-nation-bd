"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Star, Gift, TrendingUp, Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface LoyaltyStatus {
  currentLevel: string
  currentConfig: {
    name: string
    displayName: string
    color: string
    icon: string
    discount: number
    promotionRequirements: {
      orders: number
      periodMonths: number
      minOrderAmount: number
    }
    demotionRequirements: {
      minOrdersPerMonth: number
      gracePeriodMonths: number
    }
  }
  nextLevel: string | null
  nextConfig: any
  totalOrders: number
  totalSpent: number
  isEligible: boolean
  canUsePlatinumDiscount: boolean
}

export default function UserLoyaltyStatus() {
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    fetchLoyaltyStatus()
  }, [])

  const fetchLoyaltyStatus = async () => {
    try {
      const response = await fetch('/api/user/loyalty-status')
      if (response.ok) {
        const data = await response.json()
        setLoyaltyStatus(data)
      } else if (response.status === 401) {
        // User not authenticated - show login prompt
        setLoyaltyStatus(null)
      } else {
        console.error('Error fetching loyalty status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching loyalty status:', error)
    } finally {
      setLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!loyaltyStatus) {
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
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Test Account:</strong> Email: test@sportsnationbd.com, Password: password123
              </p>
            </div>
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

  if (!loyaltyStatus.isEligible) {
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

  const { currentConfig, nextConfig, totalOrders, totalSpent, canUsePlatinumDiscount } = loyaltyStatus

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Your Loyalty Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4"
          >
            <span className="text-3xl">{currentConfig.icon}</span>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: currentConfig.color }}>
                {currentConfig.displayName} Member
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentConfig.discount}৳ discount on every order
              </p>
            </div>
          </motion.div>
        </div>

        {/* Current Benefits */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Your Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">
                <strong>{currentConfig.discount}৳</strong> discount per order
              </span>
            </div>
            {currentConfig.name === 'platinum' && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Monthly limit: {canUsePlatinumDiscount ? 'Available' : 'Used this month'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <strong>{totalOrders}</strong> total orders
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Crown className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                <strong>{totalSpent.toFixed(0)}৳</strong> total spent
              </span>
            </div>
          </div>
        </div>

        {/* Next Level Progress */}
        {nextConfig && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress to {nextConfig.displayName}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Orders needed: {nextConfig.promotionRequirements.orders}</span>
                <span>Min amount: {nextConfig.promotionRequirements.minOrderAmount}৳</span>
              </div>
              <Progress 
                value={(totalOrders / nextConfig.promotionRequirements.orders) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Complete {nextConfig.promotionRequirements.orders} orders in {nextConfig.promotionRequirements.periodMonths} months to reach {nextConfig.displayName} level
              </p>
            </div>
          </div>
        )}

        {/* Level Requirements */}
        <div className="space-y-3">
          <h4 className="font-semibold">Level Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Promotion Requirements</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {currentConfig.promotionRequirements.orders} orders in {currentConfig.promotionRequirements.periodMonths} months</li>
                <li>• Minimum {currentConfig.promotionRequirements.minOrderAmount}৳ per order</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Maintenance Requirements</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• At least {currentConfig.demotionRequirements.minOrdersPerMonth} orders per month</li>
                <li>• {currentConfig.demotionRequirements.gracePeriodMonths} month grace period</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Notes */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Important Notes</h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• All discounts require minimum 1000৳ order value</li>
            <li>• Level changes are automatic based on your order history</li>
            <li>• This program is valid only for customers in Bangladesh</li>
            {currentConfig.name === 'platinum' && (
              <li>• Platinum discount can be used once per month</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
