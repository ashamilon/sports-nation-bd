'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { behaviorTracker } from '@/lib/behavior-tracker'
import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react'

export default function TestBehaviorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')

  const simulateCartAdd = async () => {
    setIsLoading(true)
    const success = await behaviorTracker.trackCartAdd('test-product-1', 'Test Jersey', 1500)
    setLastAction(success ? 'Cart addition tracked!' : 'Failed to track cart addition')
    setIsLoading(false)
  }

  const simulateCheckout = async () => {
    setIsLoading(true)
    const success = await behaviorTracker.trackCheckout(1500, 1)
    setLastAction(success ? 'Checkout tracked!' : 'Failed to track checkout')
    setIsLoading(false)
  }

  const simulatePaymentSuccess = async () => {
    setIsLoading(true)
    const success = await behaviorTracker.trackPaymentSuccess(1500)
    setLastAction(success ? 'Payment success tracked!' : 'Failed to track payment success')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Customer Behavior Testing</CardTitle>
            <p className="text-center text-muted-foreground">
              Simulate customer behavior to test the real-time tracking system
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                Phase 1: Cart Addition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simulate a customer adding a product to their cart
              </p>
              <Button 
                onClick={simulateCartAdd} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Tracking...' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
                Phase 2: Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simulate a customer starting the checkout process
              </p>
              <Button 
                onClick={simulateCheckout} 
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Tracking...' : 'Start Checkout'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Phase 3: Payment Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simulate a successful payment completion
              </p>
              <Button 
                onClick={simulatePaymentSuccess} 
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Tracking...' : 'Complete Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {lastAction && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-center text-green-600 font-medium">{lastAction}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Check the admin dashboard to see real-time updates!
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Cart Addition</h3>
                <p className="text-sm text-muted-foreground">
                  Tracked when customers add products to cart
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold">Checkout Started</h3>
                <p className="text-sm text-muted-foreground">
                  Tracked when customers reach checkout page
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Payment Success</h3>
                <p className="text-sm text-muted-foreground">
                  Tracked when payments are completed
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Real-time Updates:</strong> All behaviors are tracked for 10 minutes and update in real-time on the admin dashboard. 
                Visit <code>/admin/visitors</code> to see the live behavior analytics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
