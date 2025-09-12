"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
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

export default function OrdersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock orders data - replace with actual data from API
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-20',
      status: 'delivered',
      total: '৳2,500',
      items: [
        { name: 'Nike Air Max 270', quantity: 1, price: '৳12,000' },
        { name: 'Barcelona Home Jersey', quantity: 1, price: '৳2,500' }
      ],
      tracking: 'BD123456789',
      paymentStatus: 'paid',
      shippingAddress: 'Dhaka, Bangladesh'
    },
    {
      id: 'ORD-002',
      date: '2024-01-18',
      status: 'shipped',
      total: '৳1,800',
      items: [
        { name: 'Real Madrid Away Jersey', quantity: 1, price: '৳1,800' }
      ],
      tracking: 'BD123456788',
      paymentStatus: 'paid',
      shippingAddress: 'Chittagong, Bangladesh'
    },
    {
      id: 'ORD-003',
      date: '2024-01-15',
      status: 'processing',
      total: '৳3,200',
      items: [
        { name: 'Naviforce Watch NF9028', quantity: 1, price: '৳8,500' },
        { name: 'Adidas Ultraboost 22', quantity: 1, price: '৳15,000' }
      ],
      tracking: null,
      paymentStatus: 'partial',
      shippingAddress: 'Sylhet, Bangladesh'
    },
    {
      id: 'ORD-004',
      date: '2024-01-12',
      status: 'cancelled',
      total: '৳1,200',
      items: [
        { name: 'PSG Home Jersey', quantity: 1, price: '৳1,200' }
      ],
      tracking: null,
      paymentStatus: 'refunded',
      shippingAddress: 'Rajshahi, Bangladesh'
    }
  ]

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
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
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
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">Ordered on {order.date}</p>
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
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 glass-card rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">IMG</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">{item.price}</p>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-foreground">{order.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Address</p>
                <p className="font-medium text-foreground">{order.shippingAddress}</p>
              </div>
              {order.tracking && (
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-medium text-foreground">{order.tracking}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              
              {order.tracking && (
                <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Track Package</span>
                </button>
              )}
              
              <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </button>
              
              {order.status === 'delivered' && (
                <button className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Leave Review</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
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
    </div>
  )
}
