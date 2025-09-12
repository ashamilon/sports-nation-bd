'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { Loader2, Settings, CheckCircle, AlertCircle, Copy, MessageSquare } from 'lucide-react'

export default function SMSTestPage() {
  const [apiKey, setApiKey] = useState('')
  const [senderId, setSenderId] = useState('SPORTSBD')
  const [testPhone, setTestPhone] = useState('01712345678')
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleTestSMS = async () => {
    if (!apiKey || !testPhone) {
      toast.error('Please enter API key and phone number')
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/sms/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: testPhone,
          testType: 'order',
          apiKey: apiKey,
          senderId: senderId
        })
      })

      const result = await response.json()
      setTestResult(result)

      if (result.success) {
        toast.success('SMS sent successfully! Check your phone.')
      } else {
        toast.error(result.error || 'Failed to send SMS')
      }
    } catch (error) {
      console.error('SMS test error:', error)
      toast.error('Failed to send test SMS')
      setTestResult({ success: false, error: 'Network error' })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const envConfig = `# SMS Configuration for BulkSMSBD
SMS_PROVIDER=bulksmsbd
SMS_API_KEY=${apiKey || 'your_bulksmsbd_api_key_here'}
SMS_SENDER_ID=${senderId}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">SMS Configuration Test</h1>
            <p className="text-lg text-gray-600">Test your BulkSMSBD credentials for order confirmations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Test SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">BulkSMSBD API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your BulkSMSBD API key"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    Get this from your BulkSMSBD dashboard → API section
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderId">Sender ID</Label>
                  <Input
                    id="senderId"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder="SPORTSBD"
                    maxLength={11}
                  />
                  <p className="text-xs text-gray-500">
                    Must be approved by BulkSMSBD (6-11 characters)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testPhone">Test Phone Number</Label>
                  <Input
                    id="testPhone"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="01712345678"
                  />
                  <p className="text-xs text-gray-500">
                    Your phone number to test SMS delivery
                  </p>
                </div>

                <Button
                  onClick={handleTestSMS}
                  disabled={isLoading || !apiKey || !testPhone}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Sending Test SMS...' : 'Send Test SMS'}
                </Button>

                {testResult && (
                  <div className={`p-4 rounded-lg border ${
                    testResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        testResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {testResult.success ? 'SMS Sent Successfully!' : 'SMS Failed'}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.success ? 
                        'Check your phone for the test SMS message.' : 
                        testResult.error
                      }
                    </p>
                    {testResult.messageId && (
                      <p className="text-xs text-gray-600 mt-1">
                        Message ID: {testResult.messageId}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environment Configuration */}
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle>Environment Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Add to .env.local</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono relative">
                    <pre className="whitespace-pre-wrap">{envConfig}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => copyToClipboard(envConfig)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">BulkSMSBD Setup Steps</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Login to <a href="https://bulksmsbd.net" target="_blank" className="text-blue-600 hover:underline">bulksmsbd.net</a></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Go to API section in your dashboard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Generate a new API key</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                      <span>Copy the API key and paste it above</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                      <span>Test SMS delivery with your phone</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Pricing Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• BulkSMSBD: ~৳0.50-1.00 per SMS</div>
                    <div>• Good delivery rates in Bangladesh</div>
                    <div>• Reliable service with good support</div>
                    <div>• Easy integration and management</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <div>• Sender ID must be approved by BulkSMSBD</div>
                    <div>• SMS only sent to Bangladeshi numbers (880 prefix)</div>
                    <div>• Keep your API key secure and private</div>
                    <div>• Monitor your SMS balance regularly</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Status */}
          <Card className="mt-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">SMS Service</h4>
                  <p className="text-xs text-gray-600">Ready for BulkSMSBD</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">Payment Integration</h4>
                  <p className="text-xs text-gray-600">SSL Commerz connected</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">Auto SMS</h4>
                  <p className="text-xs text-gray-600">Order confirmations ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Info */}
          <Card className="mt-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <CardTitle>Admin Panel Access</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">To access the full admin panel:</h4>
                <div className="text-sm text-orange-700 space-y-1">
                  <div>1. You need to be logged in as an admin user</div>
                  <div>2. Admin panel is available at: <code className="bg-orange-100 px-1 rounded">/admin</code></div>
                  <div>3. SMS configuration is at: <code className="bg-orange-100 px-1 rounded">/admin/sms-config</code></div>
                  <div>4. This test page works without authentication for testing purposes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
