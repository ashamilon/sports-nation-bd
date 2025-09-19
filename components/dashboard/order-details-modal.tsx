"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  customOptions?: string
  Product: {
    id: string
    name: string
    images?: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  shippingCost: number
  tipAmount?: number
  currency: string
  paymentMethod?: string
  createdAt: string
  shippingAddress: string
  trackingNumber?: string
  OrderItem: OrderItem[]
}

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'shipped':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'partial':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'refunded':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {}

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 glass-card border-b border-white/10 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                    <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="glass-button p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Order Status</span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Payment Status</span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.OrderItem.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 glass-card rounded-lg">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {item.Product.images && item.Product.images.length > 0 ? (
                          <img 
                            src={item.Product.images[0]} 
                            alt={item.Product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">IMG</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.Product.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.customOptions && (
                          <p className="text-sm text-muted-foreground">
                            Custom: {(() => {
                              try {
                                const custom = JSON.parse(item.customOptions)
                                return `${custom.name || 'N/A'} - #${custom.number || 'N/A'}`
                              } catch {
                                return 'N/A'
                              }
                            })()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">৳{(item.price || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">৳{((item.price || 0) / (item.quantity || 1)).toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">৳{(order.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">৳{(order.shippingCost || 0).toLocaleString()}</span>
                  </div>
                  {order.tipAmount && order.tipAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip</span>
                      <span className="text-foreground">৳{(order.tipAmount || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-lg font-bold text-foreground">৳{(order.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Shipping Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground">{shippingAddress.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">
                        {shippingAddress.address || 'N/A'}, {shippingAddress.city || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-start space-x-3">
                      <Truck className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="text-foreground font-mono">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Information */}
              <div className="glass-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="text-foreground font-mono">{order.orderNumber}</p>
                    </div>
                  </div>
                  {order.paymentMethod && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="text-foreground">{order.paymentMethod}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
