"use client"

import { useState, useEffect } from 'react'
import { Package, Search, Clock, MapPin, Truck, CheckCircle, AlertCircle } from 'lucide-react'
import TrackingWidget from '@/components/tracking/tracking-widget'

interface Order {
  id: string
  orderNumber: string
  status: string
  courierService?: string
  courierTrackingId?: string
  trackingNumber?: string
  total: number
  currency: string
  createdAt: string
  shippingAddress: any
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showTracking, setShowTracking] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.courierService && order.courierService.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency === 'BDT' ? 'BDT' : 'EUR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowTracking(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Order Tracking</h2>
          <p className="text-muted-foreground">Track your orders and delivery status</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search by order number, status, or courier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(order.total, order.currency)}
                      </span>
                    </div>
                    {order.courierService && (
                      <div>
                        <span className="text-gray-500">Courier:</span>
                        <span className="ml-2 font-medium capitalize">
                          {order.courierService}
                        </span>
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div>
                        <span className="text-gray-500">Delivery to:</span>
                        <span className="ml-2 font-medium">
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {order.courierService && order.courierTrackingId && (
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Track</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleTrackOrder(order)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tracking Modal */}
      {showTracking && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Tracking - #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowTracking(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <TrackingWidget
                orderId={selectedOrder.id}
                trackingNumber={selectedOrder.trackingNumber}
                courierService={selectedOrder.courierService}
                courierTrackingId={selectedOrder.courierTrackingId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
