'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, ShoppingCart, Phone } from 'lucide-react'

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card shadow-2xl border border-red-200/40 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-2xl">
              <div className="mx-auto mb-4">
                <AlertTriangle className="h-16 w-16 text-white mx-auto" />
              </div>
              <CardTitle className="text-2xl">Payment Failed</CardTitle>
              <p className="text-white/90">
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

              <div className="bg-brand-accent/10 p-4 rounded-lg border border-brand-accent/20">
                <h4 className="font-medium text-brand-accent mb-2">What you can do:</h4>
                <ul className="text-brand-dark text-sm space-y-1">
                  <li>• Check your payment method details</li>
                  <li>• Ensure sufficient funds are available</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-200/60 shadow-sm">
                <h4 className="font-medium text-foreground mb-2">Need help?</h4>
                <p className="text-muted-foreground text-sm">
                  If you continue to experience issues, please contact our support team. 
                  We're here to help you complete your purchase.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-brand-dark" />
                  <span className="text-sm text-muted-foreground">+880 1868 556390</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/checkout')}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="flex-1 border-brand-dark/30 text-brand-dark hover:bg-brand-accent/10 hover:border-brand-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Questions about your order? Contact us at{' '}
                  <a href="mailto:support@sportsnationbd.com" className="text-brand-accent hover:underline">
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