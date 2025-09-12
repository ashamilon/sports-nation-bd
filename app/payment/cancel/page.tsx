'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <X className="h-16 w-16 text-orange-600 mx-auto" />
            </div>
            <CardTitle className="text-2xl text-orange-800">Payment Cancelled</CardTitle>
            <p className="text-orange-700">
              You cancelled the payment process. No charges have been made to your account.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Your order was not completed</h3>
              <p className="text-sm text-gray-700">
                The payment process was cancelled before completion. Your items are still 
                in your cart and you can complete the purchase at any time.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">What's next?</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Your cart items are still saved</li>
                <li>• You can review and modify your order</li>
                <li>• Try a different payment method if needed</li>
                <li>• Contact us if you need assistance</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/checkout')}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Complete Purchase
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Questions about your order? Contact us at{' '}
                <a href="mailto:support@sportsnationbd.com" className="text-primary hover:underline">
                  support@sportsnationbd.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
