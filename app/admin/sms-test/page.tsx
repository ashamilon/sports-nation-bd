'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { Loader2, MessageSquare, Phone, CheckCircle } from 'lucide-react'
import AdminLayout from '@/components/admin/admin-layout'

export default function SMSTestPage() {
  const [phone, setPhone] = useState('01712345678')
  const [testType, setTestType] = useState('order')
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const handleTestSMS = async () => {
    if (!phone) {
      toast.error('Please enter a phone number')
      return
    }

    setIsLoading(true)
    setLastResult(null)

    try {
      const response = await fetch('/api/sms/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          testType
        })
      })

      const result = await response.json()
      setLastResult(result)

      if (result.success) {
        toast.success('Test SMS sent successfully!')
      } else {
        toast.error(result.error || 'Failed to send SMS')
      }
    } catch (error) {
      console.error('SMS test error:', error)
      toast.error('Failed to send test SMS')
      setLastResult({ success: false, error: 'Network error' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.startsWith('880')) {
      return cleaned
    } else if (cleaned.startsWith('0')) {
      return '880' + cleaned.substring(1)
    } else if (cleaned.length === 11) {
      return '880' + cleaned
    } else if (cleaned.length === 10) {
      return '880' + cleaned
    }
    
    return '880' + cleaned
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS Test Dashboard</h1>
          <p className="text-gray-600">Test SMS functionality for order confirmations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SMS Test Form */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Send Test SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Bangladesh)</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712345678"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Formatted: {formatPhoneNumber(phone)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Confirmation</SelectItem>
                    <SelectItem value="simple">Simple Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleTestSMS}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Sending...' : 'Send Test SMS'}
              </Button>

              {lastResult && (
                <div className={`p-4 rounded-lg border ${
                  lastResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {lastResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      lastResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {lastResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    lastResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {lastResult.success ? lastResult.message : lastResult.error}
                  </p>
                  {lastResult.messageId && (
                    <p className="text-xs text-gray-600 mt-1">
                      Message ID: {lastResult.messageId}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SMS Configuration Info */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle>SMS Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Current Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">BulkSMSBD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sender ID:</span>
                    <span className="font-medium">SPORTSBD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">Bangladesh Only</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Message Format</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono">
                  <div>Dear [Customer Name],</div>
                  <div className="mt-1">Your order #[Order Number] has been confirmed!</div>
                  <div className="mt-1">Items: [Item List]</div>
                  <div className="mt-1">Total: ৳[Amount]</div>
                  <div className="mt-1">Delivery: [Address]</div>
                  <div className="mt-1">Thank you for choosing Sports Nation BD!</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Phone Number Format</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• Input: 01712345678 → Output: 8801712345678</div>
                  <div>• Input: +8801712345678 → Output: 8801712345678</div>
                  <div>• Input: 8801712345678 → Output: 8801712345678</div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> SMS will only be sent to Bangladeshi phone numbers (starting with 880).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Flow */}
        <Card className="mt-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle>Integration Flow</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-sm">Payment</h4>
                <p className="text-xs text-gray-600">Customer completes payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-sm">Redirect</h4>
                <p className="text-xs text-gray-600">SSL Commerz redirects to success API</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-sm">Update Order</h4>
                <p className="text-xs text-gray-600">Order status updated to confirmed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <h4 className="font-medium text-sm">Send SMS</h4>
                <p className="text-xs text-gray-600">SMS sent to customer (BD only)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">5</span>
                </div>
                <h4 className="font-medium text-sm">Confirmation</h4>
                <p className="text-xs text-gray-600">Customer receives SMS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
