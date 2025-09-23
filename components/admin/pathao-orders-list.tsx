"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'

interface PathaoOrder {
  id: string
  consignmentId: string
  merchantOrderId?: string
  storeId: number
  recipientName: string
  recipientPhone: string
  recipientSecondaryPhone?: string
  recipientAddress: string
  recipientCity?: number
  recipientZone?: number
  recipientArea?: number
  deliveryType: number
  itemType: number
  specialInstruction?: string
  itemQuantity: number
  itemWeight: number
  itemDescription?: string
  amountToCollect: number
  orderStatus: string
  deliveryFee?: number
  createdAt: string
  updatedAt: string
  User?: {
    id: string
    name?: string
    email: string
  }
  source?: 'ecommerce' | 'manual'
  originalOrderId?: string
  orderItems?: any[]
}

interface PathaoOrdersListProps {
  onOrderSelect: (order: PathaoOrder) => void
  selectedOrderId?: string
}

export default function PathaoOrdersList({ onOrderSelect, selectedOrderId }: PathaoOrdersListProps) {
  const [orders, setOrders] = useState<PathaoOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ]

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'ecommerce', label: 'E-commerce Orders' },
    { value: 'manual', label: 'Manual Orders' }
  ]

  const loadOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      params.append('limit', '100')

      const response = await fetch(`/api/pathao/orders/manage?${params}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data.orders)
      } else {
        toast.error('Failed to load orders')
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter, sourceFilter])

  const filteredOrders = orders.filter(order => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = (
        order.recipientName.toLowerCase().includes(searchLower) ||
        order.recipientPhone.includes(searchTerm) ||
        order.consignmentId.toLowerCase().includes(searchLower) ||
        (order.merchantOrderId && order.merchantOrderId.toLowerCase().includes(searchLower))
      )
      if (!matchesSearch) return false
    }

    // Filter by source
    if (sourceFilter !== 'all') {
      if (sourceFilter === 'ecommerce' && order.source !== 'ecommerce') return false
      if (sourceFilter === 'manual' && order.source !== 'manual') return false
    }

    return true
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Order Management</h3>
          <p className="text-sm text-muted-foreground">
            {filteredOrders.length} orders found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-2 rounded-lg text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="glass-input px-3 py-2 rounded-lg text-sm"
          >
            {sourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input px-3 py-2 rounded-lg text-sm"
          />
          
          <button
            onClick={loadOrders}
            disabled={loading}
            className="glass-button px-3 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No orders found</p>
            <button
              onClick={loadOrders}
              className="mt-4 glass-button px-4 py-2 rounded-lg"
            >
              Load Orders
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-4 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                  selectedOrderId === order.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onOrderSelect(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {order.recipientName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {order.consignmentId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span>{order.orderStatus}</span>
                    </div>
                    {order.source === 'ecommerce' && (
                      <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span>E-commerce</span>
                      </div>
                    )}
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{order.recipientPhone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground truncate">
                      {order.recipientAddress.length > 30 
                        ? `${order.recipientAddress.substring(0, 30)}...` 
                        : order.recipientAddress
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {order.itemQuantity} item{order.itemQuantity > 1 ? 's' : ''} • {order.itemWeight}kg
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDate(order.createdAt)}
                  </div>
                  
                  <div className="text-sm font-medium text-foreground">
                    Delivery Fee: ৳{order.deliveryFee || 0}
                    {order.amountToCollect > 0 && (
                      <span className="ml-2 text-primary">
                        • COD: ৳{order.amountToCollect}
                      </span>
                    )}
                  </div>
                </div>

                {order.merchantOrderId && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Merchant Order ID: {order.merchantOrderId}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
