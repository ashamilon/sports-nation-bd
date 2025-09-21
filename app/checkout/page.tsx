'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart-store'
import { useSession } from 'next-auth/react'
import { behaviorTracker } from '@/lib/behavior-tracker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-hot-toast'
import { Loader2, CreditCard, Globe, MapPin, User, Mail, Phone, Percent, Heart, Coffee, Star, CheckCircle, Edit3 } from 'lucide-react'

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  postalCode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full')
  const [tipAmount, setTipAmount] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [useDefaultAddress, setUseDefaultAddress] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'BD'
  })

  useEffect(() => {
    // Check for buyNowItem in sessionStorage
    const buyNowItem = sessionStorage.getItem('buyNowItem')
    const buyNowAction = sessionStorage.getItem('buyNowAction')
    
    if (items.length === 0 && !buyNowItem) {
      router.push('/')
      return
    }

    // If buyNowItem exists, handle Buy Now action
    if (buyNowItem) {
      try {
        const item = JSON.parse(buyNowItem)
        const { addItem, clearCart } = useCartStore.getState()
        
        // If this is a Buy Now action, clear existing cart first
        if (buyNowAction === 'true') {
          clearCart()
          sessionStorage.removeItem('buyNowAction')
        }
        
        // Add the item to cart
        addItem(item)
        
        // Clear the buyNowItem from sessionStorage
        sessionStorage.removeItem('buyNowItem')
        toast.success('Item added to checkout!')
      } catch (error) {
        console.error('Error parsing buyNowItem:', error)
        sessionStorage.removeItem('buyNowItem')
        sessionStorage.removeItem('buyNowAction')
      }
    }

    // Track checkout behavior
    const currentItems = items.length > 0 ? items : (buyNowItem ? [JSON.parse(buyNowItem)] : [])
    const totalValue = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = currentItems.reduce((sum, item) => sum + item.quantity, 0)
    behaviorTracker.trackCheckout(totalValue, itemCount)
  }, [items, router])

  // Auto-fill with session data when session becomes available
  useEffect(() => {
    if (session?.user && !userProfile) {
      setCustomerInfo(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }))
    }
  }, [session, userProfile])

  // Fetch user profile and auto-fill form
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return
      
      setIsLoadingProfile(true)
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUserProfile(data.user)
            // Auto-fill the form with user's default information
            const newCustomerInfo = {
              name: data.user.name || session.user.name || '',
              email: data.user.email || session.user.email || '',
              phone: data.user.phone || '',
              address: data.user.address || '',
              city: data.user.city || '',
              country: data.user.country || 'BD'
            }
            setCustomerInfo(newCustomerInfo)
            // Set useDefaultAddress to true if user has a default address
            if (data.user.address) {
              setUseDefaultAddress(true)
            } else {
              // Even if no saved address, auto-fill with session data if available
              if (session.user.name || session.user.email) {
                setUseDefaultAddress(true)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [session])

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleUseDefaultAddress = () => {
    if (userProfile) {
      setCustomerInfo({
        name: userProfile.name || session?.user?.name || '',
        email: userProfile.email || session?.user?.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        country: userProfile.country || 'BD'
      })
      setUseDefaultAddress(true)
    }
  }

  const handleUseCustomAddress = () => {
    setUseDefaultAddress(false)
    // Keep current form data but mark as custom
  }

  const handleSaveAsDefault = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          country: customerInfo.country
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserProfile(data.user)
          setUseDefaultAddress(true)
          toast.success('Address saved as default!')
        }
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
    }
  }

  const getSubtotal = () => {
    return getTotalPrice()
  }

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal()
    // Free delivery for orders over ৳2,000, otherwise ৳100 delivery charge
    return subtotal >= 2000 ? 0 : 100
  }

  const getTipAmount = () => {
    if (customTip) {
      return parseFloat(customTip) || 0
    }
    return tipAmount
  }

  const getTotalAmount = () => {
    const subtotal = getSubtotal()
    const delivery = getDeliveryCharge()
    const tip = getTipAmount()
    const total = subtotal + delivery + tip
    
    if (paymentType === 'partial') {
      return total * 0.2 // 20% partial payment
    }
    return total
  }

  const getRemainingAmount = () => {
    if (paymentType === 'partial') {
      const subtotal = getSubtotal()
      const delivery = getDeliveryCharge()
      const tip = getTipAmount()
      const total = subtotal + delivery + tip
      return total * 0.8 // 80% remaining
    }
    return 0
  }

  const handleTipChange = (amount: number) => {
    setTipAmount(amount)
    setCustomTip('')
  }

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    setTipAmount(0)
  }

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const paymentAmount = getTotalAmount()
      const subtotal = getSubtotal()
      const delivery = getDeliveryCharge()
      const tip = getTipAmount()
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId,
            variantName: item.variantName,
            customOptions: item.customOptions
          })),
          customerInfo,
          currency: 'BDT',
          paymentType,
          subtotal,
          deliveryCharge: delivery,
          tipAmount: tip,
          totalAmount: paymentAmount,
          remainingAmount: getRemainingAmount(),
          returnUrl: `${window.location.origin}/api/payments/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          failUrl: `${window.location.origin}/payment/failed`
        })
      })

      const data = await response.json()

      if (data.success && data.paymentUrl) {
        // Clear cart and redirect to payment
        clearCart()
        window.location.href = data.paymentUrl
      } else {
        toast.error(data.error || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment initialization failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push('/')}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-blue-200/40 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)'}}>
            <CardHeader className="bg-gradient-to-r from-brand-accent to-brand-dark text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-6 w-6" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Address Selection */}
              {isLoadingProfile ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading your profile...</span>
                </div>
              ) : userProfile ? (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Delivery Address</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={useDefaultAddress ? "default" : "outline"}
                      size="sm"
                      onClick={handleUseDefaultAddress}
                      className="flex items-center gap-2"
                      disabled={isLoadingProfile}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Use Default Address
                    </Button>
                    <Button
                      variant={!useDefaultAddress ? "default" : "outline"}
                      size="sm"
                      onClick={handleUseCustomAddress}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Use Different Address
                    </Button>
                  </div>
                  
                  {useDefaultAddress && userProfile.address && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Using your default address:
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        {userProfile.address}, {userProfile.city}, {userProfile.country}
                      </p>
                    </div>
                  )}
                  
                  {!useDefaultAddress && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">Using custom address</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSaveAsDefault}
                        className="text-blue-700 border-blue-300 hover:bg-blue-100"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Save as Default Address
                      </Button>
                    </div>
                  )}
                  
                  <Separator />
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="country"
                      type="text"
                      value={customerInfo.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-green-200/40 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.1)'}}>
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-6 w-6" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50/80 rounded-lg border border-gray-200/60 shadow-sm">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        {item.variantName && (
                          <p className="text-sm text-gray-600">{item.variantName}</p>
                        )}
                        {item.customOptions && (
                          <div className="text-sm text-gray-600">
                            {item.customOptions.name && <p>Name: {item.customOptions.name}</p>}
                            {item.customOptions.number && <p>Number: {item.customOptions.number}</p>}
                            {item.customOptions.badges && item.customOptions.badges.length > 0 && (
                              <p>Badges: {item.customOptions.badges.length} selected</p>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-green-600">৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">৳{getSubtotal().toFixed(2)}</span>
                    </div>
                    
                    {/* Delivery Charge */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery</span>
                      <span className={`font-medium ${getDeliveryCharge() === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                        {getDeliveryCharge() === 0 ? 'FREE' : `৳${getDeliveryCharge().toFixed(2)}`}
                      </span>
                    </div>
                    
                    {getDeliveryCharge() > 0 && (
                      <p className="text-xs text-gray-600">
                        * Free delivery on orders over ৳2,000
                      </p>
                    )}
                    
                    {/* Tips Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600 font-medium">Add a tip</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {[50, 100, 200].map((amount) => (
                          <Button
                            key={amount}
                            variant={tipAmount === amount ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTipChange(amount)}
                            className="text-sm"
                          >
                            ৳{amount}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          value={customTip}
                          onChange={(e) => handleCustomTipChange(e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-gray-600 text-sm">৳</span>
                      </div>
                      
                      {getTipAmount() > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Tip</span>
                          <span className="font-medium text-red-600">৳{getTipAmount().toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-green-600">৳{(getSubtotal() + getDeliveryCharge() + getTipAmount()).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-blue-200/40 rounded-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)'}}>
              <CardHeader className="bg-gradient-to-r from-brand-accent to-brand-dark text-white rounded-t-2xl">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-6 w-6" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Payment Type Selection */}
                <div className="space-y-3">
                  <Label className="text-lg font-medium">Payment Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={paymentType === 'full' ? "default" : "outline"}
                      onClick={() => setPaymentType('full')}
                      className="h-12 text-sm"
                    >
                      <Percent className="h-4 w-4 mr-2" />
                      Full Payment
                    </Button>
                    <Button
                      variant={paymentType === 'partial' ? "default" : "outline"}
                      onClick={() => setPaymentType('partial')}
                      className="h-12 text-sm"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      20% Down Payment
                    </Button>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white/90 p-4 rounded-lg space-y-2 border border-gray-200/60 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Total</span>
                    <span className="font-medium text-gray-800">৳{(getSubtotal() + getDeliveryCharge() + getTipAmount()).toFixed(2)}</span>
                  </div>
                  
                  {paymentType === 'partial' && (
                    <>
                      <div className="flex justify-between items-center text-green-600">
                        <span>Payment Now (20%)</span>
                        <span className="font-bold">৳{getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Remaining (80%)</span>
                        <span className="font-medium">৳{getRemainingAmount().toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        * Remaining amount will be collected upon delivery
                      </p>
                    </>
                  )}
                  
                  {paymentType === 'full' && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Total Payment</span>
                      <span className="font-bold">৳{getTotalAmount().toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-6 w-6 mr-2" />
                  )}
                  {paymentType === 'partial' 
                    ? `Pay ৳${getTotalAmount().toFixed(2)} Now (20%)`
                    : `Pay ৳${getTotalAmount().toFixed(2)} Now`
                  }
                </Button>
                
                <p className="text-xs text-gray-600 text-center">
                  Secure payment powered by SSL Commerz
                </p>
                
                {/* Payment Banner */}
                <div className="mt-4 flex justify-center">
                  <Image
                    src="/payment-banner.png"
                    alt="Payment Methods"
                    width={400}
                    height={130}
                    className="rounded-lg shadow-sm max-w-full h-auto"
                    unoptimized
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}