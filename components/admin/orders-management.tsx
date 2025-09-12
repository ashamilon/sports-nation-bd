"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Download,
  Printer
} from 'lucide-react'

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  // Mock data - replace with actual data from API
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+880 1234 567890'
      },
      items: [
        { name: 'Barcelona Home Jersey 2024', quantity: 1, price: 2500 },
        { name: 'Nike Air Max 270', quantity: 1, price: 8500 }
      ],
      total: 11000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'bKash',
      shippingAddress: 'Dhaka, Bangladesh',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+880 9876 543210'
      },
      items: [
        { name: 'Real Madrid Away Jersey', quantity: 2, price: 2800 }
      ],
      total: 5600,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Bank Transfer',
      shippingAddress: 'Chittagong, Bangladesh',
      orderDate: '2024-01-15',
      deliveryDate: null,
      trackingNumber: null
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+880 5555 123456'
      },
      items: [
        { name: 'Naviforce Watch NF9026', quantity: 1, price: 4200 }
      ],
      total: 4200,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Cash on Delivery',
      shippingAddress: 'Sylhet, Bangladesh',
      orderDate: '2024-01-14',
      deliveryDate: null,
      trackingNumber: null
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        phone: '+880 7777 888999'
      },
      items: [
        { name: 'Manchester United Home Jersey', quantity: 1, price: 2600 },
        { name: 'Adidas Ultraboost 22', quantity: 1, price: 12000 }
      ],
      total: 14600,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Rocket',
      shippingAddress: 'Rajshahi, Bangladesh',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-20',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-005',
      customer: {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        phone: '+880 3333 444555'
      },
      items: [
        { name: 'Barcelona Home Jersey 2024', quantity: 3, price: 2500 }
      ],
      total: 7500,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'bKash',
      shippingAddress: 'Khulna, Bangladesh',
      orderDate: '2024-01-13',
      deliveryDate: null,
      trackingNumber: null
    }
  ]

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'processing':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
      case 'shipped':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20'
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
      case 'cancelled':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
      case 'refunded':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
      case 'failed':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    const id = parseInt(orderId.replace('ORD-', ''))
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => parseInt(order.id.replace('ORD-', ''))))
    }
  }

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0)

  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const processingOrders = orders.filter(order => order.status === 'processing').length
  const completedOrders = orders.filter(order => order.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print Orders</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-500">৳{totalRevenue.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-blue-500">{processingOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{completedOrders}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 py-2 rounded-lg w-full md:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input px-4 py-2 rounded-lg"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedOrders.length} selected
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-3 py-1 rounded-lg text-sm text-red-500 hover:bg-red-500/10"
              >
                Bulk Actions
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Order ID</th>
                <th className="text-left p-4 font-medium text-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-foreground">Items</th>
                <th className="text-left p-4 font-medium text-foreground">Total</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Payment</th>
                <th className="text-left p-4 font-medium text-foreground">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(parseInt(order.id.replace('ORD-', '')))}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-muted-foreground">Track: {order.trackingNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm">
                          <p className="text-foreground">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity} × ৳{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">৳{order.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground">{order.orderDate}</p>
                      {order.deliveryDate && (
                        <p className="text-sm text-muted-foreground">Delivered: {order.deliveryDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 rounded-lg"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-3 py-2 rounded-lg text-sm"
          >
            Previous
          </motion.button>
          <span className="px-3 py-2 text-sm text-foreground">1</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-3 py-2 rounded-lg text-sm"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  )
}
