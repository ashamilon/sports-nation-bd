"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  Search, 
  Filter, 
  Package, 
  CheckCircle, 
  Clock, 
  XCircle,
  Truck,
  Eye,
  Download
} from 'lucide-react'
import OrderDetailsModal from './order-details-modal'

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
  Payment?: Array<{
    id: string
    amount: number
    status: string
    paymentMethod: string
    transactionId?: string
    metadata?: string
    createdAt: string
  }>
}

export default function OrdersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log('Fetching orders for user:', session?.user?.id)
      const response = await fetch('/api/user/orders')
      console.log('Orders API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Orders data received:', data)
        setOrders(data.orders || [])
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch orders:', errorData)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.OrderItem.some(item => item.Product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleDownloadInvoice = async (order: Order) => {
    try {
      setDownloadingInvoice(order.id)
      
      const response = await fetch(`/api/orders/${order.id}/invoice`)
      if (!response.ok) {
        throw new Error('Failed to fetch invoice data')
      }
      
      // Get the HTML content
      const htmlContent = await response.text()
      
      // Create a blob and download it
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${order.orderNumber}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setDownloadingInvoice(null)
    }
  }

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-2">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2 rounded-lg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input px-4 py-2 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="glass-card p-4 rounded-lg mb-4">
        <p className="text-sm text-muted-foreground">
          Debug: User ID: {session?.user?.id || 'Not authenticated'} | 
          Loading: {loading ? 'Yes' : 'No'} | 
          Orders Count: {orders.length}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      )}

      {/* Orders List */}
      {!loading && (
        <div className="space-y-4">
               {filteredOrders.map((order, index) => {
                 const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {}
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-2 md:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.OrderItem.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 glass-card rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
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
                        <div>
                          <p className="font-medium text-foreground">{item.Product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                               {item.customOptions && (
                                 <p className="text-xs text-muted-foreground">
                                   Custom: {(() => {
                                     try {
                                       const custom = JSON.parse(item.customOptions)
                                       return custom.name || 'N/A'
                                     } catch {
                                       return 'N/A'
                                     }
                                   })()}
                                 </p>
                               )}
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">৳{(item.price || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-foreground">৳{(order.total || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-medium text-foreground">
                      {shippingAddress.address || 'N/A'}, {shippingAddress.city || 'N/A'}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium text-foreground">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      
                      {order.trackingNumber && (
                        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-colors">
                          <Truck className="h-4 w-4" />
                          <span>Track Package</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDownloadInvoice(order)}
                        disabled={downloadingInvoice === order.id}
                        className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                        <span>
                          {downloadingInvoice === order.id ? 'Downloading...' : 'Download Invoice'}
                        </span>
                      </button>
                      
                      {order.status === 'delivered' && (
                        <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-colors">
                          <CheckCircle className="h-4 w-4" />
                          <span>Leave Review</span>
                        </button>
                      )}
                    </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'You haven\'t placed any orders yet.'
            }
          </p>
          <button className="glass-button px-6 py-3 rounded-lg">
            Start Shopping
          </button>
        </motion.div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
      />
    </div>
  )
}
