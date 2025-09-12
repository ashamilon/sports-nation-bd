'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowLeft, ShoppingBag, Package } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-white mx-auto" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <p className="text-green-100">
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
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• You'll receive an email confirmation</li>
                  <li>• We'll prepare your order for shipping</li>
                  <li>• You'll get tracking information once shipped</li>
                  <li>• Delivery typically takes 3-7 business days</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Order Support</h4>
                <p className="text-yellow-700 text-sm">
                  Need to track your order or have questions? You can view your order 
                  status in your account dashboard or contact our support team.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="flex-1"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
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
    </div>
  )
}