'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, ShoppingCart, Phone } from 'lucide-react'

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
              <div className="mx-auto mb-4">
                <AlertTriangle className="h-16 w-16 text-white mx-auto" />
              </div>
              <CardTitle className="text-2xl">Payment Failed</CardTitle>
              <p className="text-red-100">
                We encountered an issue processing your payment. Please try again.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold mb-3 text-red-800">Payment was not successful</h3>
                <p className="text-sm text-red-700">
                  There was an issue processing your payment. This could be due to insufficient funds, 
                  incorrect card details, or a temporary issue with the payment gateway.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Check your payment method details</li>
                  <li>• Ensure sufficient funds are available</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Need help?</h4>
                <p className="text-yellow-700 text-sm">
                  If you continue to experience issues, please contact our support team. 
                  We're here to help you complete your purchase.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">+880 1234 567890</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/checkout')}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Try Again
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
    </div>
  )
}