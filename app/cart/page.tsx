'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { formatCurrency } from '@/lib/currency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { resolveBadgeNames } from '@/lib/badge-helper'

// Cart Item Component with Badge Name Resolution
function CartItem({ item, onQuantityChange, onRemove }: { 
  item: any, 
  onQuantityChange: (id: string, quantity: number) => void, 
  onRemove: (id: string) => void 
}) {
  const [badgeNames, setBadgeNames] = useState<string[]>([])

  useEffect(() => {
    const loadBadgeNames = async () => {
      if (item.customOptions?.badges && item.customOptions.badges.length > 0) {
        try {
          const names = await resolveBadgeNames(item.customOptions.badges)
          setBadgeNames(names)
        } catch (error) {
          console.error('Error resolving badge names:', error)
          setBadgeNames(item.customOptions.badges) // Fallback to IDs
        }
      }
    }
    loadBadgeNames()
  }, [item.customOptions?.badges])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            
            {item.variantName && (
              <p className="text-sm text-muted-foreground mb-2">
                {item.variantName}
              </p>
            )}
            
            {item.customOptions && (
              <div className="text-sm text-muted-foreground mb-3">
                <h4 className="font-medium mb-1">Customizations:</h4>
                {item.customOptions.name && (
                  <p>• Name: {item.customOptions.name}</p>
                )}
                {item.customOptions.number && (
                  <p>• Number: {item.customOptions.number}</p>
                )}
                {badgeNames.length > 0 && (
                  <p>• Badges: {badgeNames.join(', ')}</p>
                )}
                {(item.customOptions as any).badgeTotal && (item.customOptions as any).badgeTotal > 0 && (
                  <p>• Badge Total: {formatCurrency((item.customOptions as any).badgeTotal)}</p>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {formatCurrency(item.price)}
              </span>
              
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Remove Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  const router = useRouter()
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCartStore()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()}):</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-green-600">
                  {(getTotalPrice() || 0) >= 2000 ? 'Free' : '৳100'}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  {formatCurrency((getTotalPrice() || 0) + ((getTotalPrice() || 0) >= 2000 ? 0 : 100))}
                </span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  onClick={clearCart}
                  variant="outline"
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>🚚 Free delivery on orders over ৳2,000</p>
                <p>💳 Secure payment with SSL Commerz & PayPal</p>
                <p>🔄 Easy returns within 7 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}