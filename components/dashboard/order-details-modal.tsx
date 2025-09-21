"use client"

import { useState, useEffect } from 'react'
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
  XCircle,
  Award
} from 'lucide-react'
import Image from 'next/image'

interface Badge {
  id: string
  name: string
  description?: string
  price: number
  image?: string
}

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

interface Payment {
  id: string
  amount: number
  status: string
  paymentMethod: string
  transactionId?: string
  metadata?: string
  createdAt: string
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
  Payment?: Payment[]
}

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loadingBadges, setLoadingBadges] = useState(false)

  // Fetch badges when modal opens
  useEffect(() => {
    if (isOpen && order) {
      fetchBadges()
    }
  }, [isOpen, order])

  const fetchBadges = async () => {
    setLoadingBadges(true)
    try {
      const response = await fetch('/api/badges')
      if (response.ok) {
        const data = await response.json()
        setBadges(data.badges || [])
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoadingBadges(false)
    }
  }

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

  // Helper function to get badge details by ID
  const getBadgeDetails = (badgeId: string): Badge | undefined => {
    return badges.find(badge => badge.id === badgeId)
  }

  // Helper function to parse custom options and get badge information
  const parseCustomOptions = (customOptions: string) => {
    try {
      const parsed = JSON.parse(customOptions)
      return {
        name: parsed.name,
        number: parsed.number,
        badges: parsed.badges || [],
        badgeTotal: parsed.badgeTotal || 0
      }
    } catch {
      return {
        name: null,
        number: null,
        badges: [],
        badgeTotal: 0
      }
    }
  }

  // Helper function to calculate payment breakdown
  const getPaymentBreakdown = () => {
    const totalAmount = order.total || 0
    const paidAmount = order.Payment?.reduce((sum, payment) => {
      if (payment.status === 'completed' || payment.status === 'paid') {
        return sum + payment.amount
      }
      return sum
    }, 0) || 0

    const isPartialPayment = order.paymentStatus === 'partial' || order.paymentMethod === 'partial_payment'
    const dueAmount = totalAmount - paidAmount

    // Try to get remaining amount from payment metadata
    let remainingAmount = dueAmount
    if (order.Payment && order.Payment.length > 0) {
      try {
        const metadata = JSON.parse(order.Payment[0].metadata || '{}')
        if (metadata.remainingAmount) {
          remainingAmount = metadata.remainingAmount
        }
      } catch (e) {
        // Use calculated due amount if metadata parsing fails
      }
    }

    return {
      totalAmount,
      paidAmount,
      dueAmount: Math.max(0, dueAmount),
      remainingAmount: Math.max(0, remainingAmount),
      isPartialPayment,
      paymentType: isPartialPayment ? 'Partial Payment' : 'Full Payment'
    }
  }

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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #FEFEFE 0%, #E7E9F0 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <motion.div 
              className="sticky top-0 border-b border-white/10 p-6 rounded-t-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              animate={{ 
                y: [0, -2, 0],
                boxShadow: [
                  '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '0 12px 40px rgba(0, 0, 0, 0.15)',
                  '0 8px 32px rgba(0, 0, 0, 0.1)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
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
            </motion.div>

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
              <motion.div 
                className="p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ 
                  y: [0, -1, 0],
                  boxShadow: [
                    '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '0 10px 35px rgba(0, 0, 0, 0.12)',
                    '0 8px 32px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
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
                        
                        {item.customOptions && (() => {
                          const custom = parseCustomOptions(item.customOptions)
                          return (
                            <div className="mt-2 space-y-2">
                              {/* Name and Number */}
                              {(custom.name || custom.number) && (
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Custom: </span>
                                  {custom.name && <span>{custom.name}</span>}
                                  {custom.name && custom.number && <span> - </span>}
                                  {custom.number && <span>#{custom.number}</span>}
                                </div>
                              )}
                              
                              {/* Football Badges */}
                              {custom.badges && custom.badges.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Football Badges:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {custom.badges.map((badgeId: string) => {
                                      const badge = getBadgeDetails(badgeId)
                                      return (
                                        <div
                                          key={badgeId}
                                          className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
                                        >
                                          {badge?.image && (
                                            <Image
                                              src={badge.image}
                                              alt={badge.name}
                                              width={20}
                                              height={20}
                                              className="rounded"
                                              unoptimized={badge.image.includes('/api/placeholder')}
                                            />
                                          )}
                                          <span className="text-xs font-medium text-foreground">
                                            {badge?.name || `Badge ${badgeId}`}
                                          </span>
                                          {badge?.price && (
                                            <span className="text-xs text-muted-foreground">
                                              (৳{badge.price.toLocaleString()})
                                            </span>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                  {custom.badgeTotal > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium">Badge Total: </span>
                                      ৳{custom.badgeTotal.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">৳{(item.price || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">৳{((item.price || 0) / (item.quantity || 1)).toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div 
                className="p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ 
                  y: [0, -1, 0],
                  boxShadow: [
                    '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '0 10px 35px rgba(0, 0, 0, 0.12)',
                    '0 8px 32px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
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
              </motion.div>

              {/* Payment Breakdown */}
              <motion.div 
                className="p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ 
                  y: [0, -1, 0],
                  boxShadow: [
                    '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '0 10px 35px rgba(0, 0, 0, 0.12)',
                    '0 8px 32px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                {(() => {
                  const breakdown = getPaymentBreakdown()
                  return (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Payment Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-semibold">Payment Type</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                          breakdown.isPartialPayment 
                            ? 'bg-yellow-500 text-white border-2 border-yellow-600'
                            : 'bg-green-500 text-white border-2 border-green-600'
                        }`}>
                          {breakdown.paymentType}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Order Amount</span>
                        <span className="text-foreground font-semibold">৳{breakdown.totalAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">৳{breakdown.paidAmount.toLocaleString()}</span>
                      </div>
                      
                      {breakdown.isPartialPayment && breakdown.remainingAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining Amount</span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">৳{breakdown.remainingAmount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {breakdown.dueAmount > 0 && (
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-foreground">Amount Due</span>
                            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">৳{breakdown.dueAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                      
                      {breakdown.paidAmount >= breakdown.totalAmount && (
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-foreground">Payment Status</span>
                            <span className="text-lg font-bold bg-green-500 text-white px-3 py-1 rounded-full shadow-md border-2 border-green-600">Fully Paid</span>
                          </div>
                        </div>
                      )}
                    </div>
                    </>
                  )
                })()}
              </motion.div>

              {/* Shipping Information */}
              <motion.div 
                className="p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ 
                  y: [0, -1, 0],
                  boxShadow: [
                    '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '0 10px 35px rgba(0, 0, 0, 0.12)',
                    '0 8px 32px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
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
              </motion.div>

              {/* Order Information */}
              <motion.div 
                className="p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ 
                  y: [0, -1, 0],
                  boxShadow: [
                    '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '0 10px 35px rgba(0, 0, 0, 0.12)',
                    '0 8px 32px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.5
                }}
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
