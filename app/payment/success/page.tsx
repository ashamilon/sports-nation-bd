'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowLeft, ShoppingBag, Package } from 'lucide-react'
import { behaviorTracker } from '@/lib/behavior-tracker'

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Track payment success behavior
    // We'll get the order value from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const orderValue = parseFloat(urlParams.get('amount') || '0')
    
    if (orderValue > 0) {
      behaviorTracker.trackPaymentSuccess(orderValue)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-green-200/40 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.1)'}}>
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-white mx-auto" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <p className="text-white/90">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold mb-3 text-green-800">Order Confirmed</h3>
                <p className="text-sm text-green-700">
                  Your payment has been processed successfully. You will receive an email 
                  confirmation shortly with your order details and tracking information.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• You'll receive an email confirmation</li>
                  <li>• We'll prepare your order for shipping</li>
                  <li>• You'll get tracking information once shipped</li>
                  <li>• Delivery typically takes 3-7 business days</li>
                </ul>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-200/60 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">Order Support</h4>
                <p className="text-gray-600 text-sm">
                  Need to track your order or have questions? You can view your order 
                  status in your account dashboard or contact our support team.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Questions about your order? Contact us at{' '}
                  <a href="mailto:support@sportsnationbd.com" className="text-blue-600 hover:underline">
                    support@sportsnationbd.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}