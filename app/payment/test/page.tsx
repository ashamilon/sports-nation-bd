'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TestPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'cancelled'>('pending')
  const [isProcessing, setIsProcessing] = useState(false)

  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    // Auto-process the payment after 2 seconds
    const timer = setTimeout(() => {
      setIsProcessing(true)
      
      // Simulate payment processing
      setTimeout(() => {
        // For testing purposes, always succeed to provide better user experience
        setPaymentStatus('success')
        setIsProcessing(false)
      }, 2000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleCancel = () => {
    setPaymentStatus('cancelled')
  }

  const handleRetry = () => {
    setPaymentStatus('pending')
    setIsProcessing(false)
  }

  const handleManualSuccess = () => {
    setPaymentStatus('success')
    setIsProcessing(false)
  }

  const handleManualFailure = () => {
    setPaymentStatus('failed')
    setIsProcessing(false)
  }

  const handleContinue = () => {
    if (paymentStatus === 'success') {
      router.push('/payment/success')
    } else if (paymentStatus === 'failed') {
      router.push('/payment/failed')
    } else if (paymentStatus === 'cancelled') {
      router.push('/payment/cancel')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card shadow-2xl border border-brand-dark/20 rounded-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {paymentStatus === 'pending' && (
                  <Clock className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
                )}
                {paymentStatus === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                )}
                {paymentStatus === 'failed' && (
                  <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                )}
                {paymentStatus === 'cancelled' && (
                  <XCircle className="h-16 w-16 text-orange-600 mx-auto" />
                )}
              </div>
              <CardTitle className="text-2xl text-foreground">
                {paymentStatus === 'pending' && 'Test Payment Processing'}
                {paymentStatus === 'success' && 'Payment Successful!'}
                {paymentStatus === 'failed' && 'Payment Failed'}
                {paymentStatus === 'cancelled' && 'Payment Cancelled'}
              </CardTitle>
              <p className="text-muted-foreground">
                {paymentStatus === 'pending' && 'Processing your test payment...'}
                {paymentStatus === 'success' && 'Your test payment has been processed successfully.'}
                {paymentStatus === 'failed' && 'Your test payment could not be processed.'}
                {paymentStatus === 'cancelled' && 'You cancelled the test payment.'}
              </p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Payment Details */}
              <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-200/60 shadow-sm">
                <h3 className="font-semibold mb-3 text-foreground">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-foreground">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-foreground">৳{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="text-foreground">Test Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-semibold ${
                      paymentStatus === 'success' ? 'text-green-600' :
                      paymentStatus === 'failed' ? 'text-red-600' :
                      paymentStatus === 'cancelled' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      {paymentStatus === 'pending' && 'Processing...'}
                      {paymentStatus === 'success' && 'Completed'}
                      {paymentStatus === 'failed' && 'Failed'}
                      {paymentStatus === 'cancelled' && 'Cancelled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing Animation */}
              {isProcessing && (
                <div className="bg-blue-50/80 p-4 rounded-lg border border-blue-200/60">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 font-medium">Processing payment...</span>
                  </div>
                </div>
              )}

              {/* Test Mode Notice */}
              <div className="bg-yellow-50/80 p-4 rounded-lg border border-yellow-200/60">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Test Mode Active</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a test payment. No real money will be charged.
                </p>
              </div>

              {/* Manual Testing Controls */}
              {paymentStatus === 'pending' && (
                <div className="bg-blue-50/80 p-4 rounded-lg border border-blue-200/60">
                  <div className="flex items-center space-x-2 mb-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">Manual Testing Controls</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleManualSuccess}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      Force Success
                    </Button>
                    <Button
                      onClick={handleManualFailure}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      Force Failure
                    </Button>
                  </div>
                  <p className="text-blue-700 text-xs mt-2">
                    Use these buttons to test different payment scenarios manually.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {paymentStatus === 'pending' && (
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Payment
                  </Button>
                )}
                
                {paymentStatus === 'failed' && (
                  <>
                    <Button
                      onClick={handleRetry}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={handleContinue}
                      variant="outline"
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  </>
                )}
                
                {(paymentStatus === 'success' || paymentStatus === 'cancelled') && (
                  <Button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-brand-accent to-brand-dark hover:from-brand-dark hover:to-brand-accent"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
