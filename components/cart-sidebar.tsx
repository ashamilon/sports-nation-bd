"use client"

import { useCartStore, CartItem } from '@/lib/store/cart-store'
import { formatCurrency } from '@/lib/currency'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getTotalItems 
  } = useCartStore()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md glass-sidebar z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({getTotalItems()})
          </h2>
          <button
            onClick={toggleCart}
            className="glass-button p-2 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some products to get started
              </p>
              <Link
                href="/"
                onClick={toggleCart}
                className="glass-button px-6 py-2 rounded-lg"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Subtotal:</span>
              <span className="text-lg font-bold">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>

            {/* Delivery Info */}
            <div className="text-sm text-muted-foreground">
              <p>🚚 Free delivery on orders over ৳2,000</p>
              <p>💳 20% down payment available</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={toggleCart}
                className="glass-button w-full py-3 rounded-lg text-center block"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="glass-button w-full py-3 rounded-lg text-center block"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

interface CartItemCardProps {
  item: CartItem
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  return (
    <div className="flex gap-3 p-3 glass-card rounded-lg">
      {/* Product Image */}
      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.name}</h4>
        {item.variantName && (
          <p className="text-xs text-muted-foreground">{item.variantName}</p>
        )}
        {item.customOptions && (
          <div className="text-xs text-muted-foreground mt-1">
            {item.customOptions.badges && (
              <p>Badges: {item.customOptions.badges.join(', ')}</p>
            )}
            {item.customOptions.name && (
              <p>Name: {item.customOptions.name}</p>
            )}
            {item.customOptions.number && (
              <p>Number: {item.customOptions.number}</p>
            )}
          </div>
        )}
        
        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium text-sm">
            {formatCurrency(item.price)}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center glass-card rounded-lg">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="glass-button p-1 rounded"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-2 text-sm">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="glass-button p-1 rounded"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="glass-button p-1 text-destructive rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
