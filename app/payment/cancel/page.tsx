'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card shadow-2xl border border-brand-dark/20 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 rounded-t-2xl">
              <div className="mx-auto mb-4">
                <X className="h-16 w-16 text-red-600 mx-auto" />
              </div>
              <CardTitle className="text-2xl text-foreground">Payment Cancelled</CardTitle>
              <p className="text-muted-foreground">
                You cancelled the payment process. No charges have been made to your account.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-200/60 shadow-sm">
                <h3 className="font-semibold mb-3 text-foreground">Your order was not completed</h3>
                <p className="text-sm text-muted-foreground">
                  The payment process was cancelled before completion. Your items are still 
                  in your cart and you can complete the purchase at any time.
                </p>
              </div>

              <div className="bg-brand-accent/10 p-4 rounded-lg border border-brand-accent/20">
                <h4 className="font-medium text-brand-accent mb-2">What's next?</h4>
                <ul className="text-brand-dark text-sm space-y-1">
                  <li>• Your cart items are still saved</li>
                  <li>• You can review and modify your order</li>
                  <li>• Try a different payment method if needed</li>
                  <li>• Contact us if you need assistance</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/checkout')}
                  className="flex-1 bg-gradient-to-r from-brand-accent to-brand-dark hover:from-brand-dark hover:to-brand-accent shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Complete Purchase
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
