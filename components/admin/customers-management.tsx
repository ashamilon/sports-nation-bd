"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  DollarSign,
  MoreVertical,
  UserPlus,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react'

export default function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showMoreActions, setShowMoreActions] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState<any>({})

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      // Don't close if clicking on the dropdown button or dropdown content
      if (showMoreActions && !target.closest('.dropdown-container')) {
        setShowMoreActions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreActions])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      } else {
        setError('Failed to fetch customers')
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('Failed to fetch customers')
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = ['all', 'active', 'inactive', 'vip']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20'
      case 'inactive':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
      case 'vip':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢'
      case 'inactive':
        return '⚫'
      case 'vip':
        return '👑'
      default:
        return '⚪'
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id))
    }
  }

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleSendEmail = (customer: any) => {
    setSelectedCustomer(customer)
    setShowEmailModal(true)
  }

  const handleMoreActions = (customerId: string) => {
    setShowMoreActions(showMoreActions === customerId ? null : customerId)
  }

  const handleCloseModals = () => {
    setShowCustomerModal(false)
    setShowEmailModal(false)
    setShowMoreActions(null)
    setSelectedCustomer(null)
    setIsEditMode(false)
    setEditFormData({})
  }

  const handleSaveCustomer = async () => {
    try {
      const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        await fetchCustomers()
        setIsEditMode(false)
        setShowCustomerModal(false)
        alert('Customer updated successfully!')
      } else {
        alert('Failed to update customer')
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('An error occurred while updating customer')
    }
  }

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      status: customer.status
    })
    setIsEditMode(true)
    setShowCustomerModal(true)
    setShowMoreActions(null)
  }

  const handleViewOrders = (customer: any) => {
    // Navigate to orders page with customer filter
    window.open(`/admin/orders?customer=${customer.id}`, '_blank')
    setShowMoreActions(null)
  }

  const handleBlockCustomer = async (customer: any) => {
    if (confirm(`Are you sure you want to ${customer.status === 'blocked' ? 'unblock' : 'block'} ${customer.name}?`)) {
      try {
        const response = await fetch(`/api/admin/customers/${customer.id}/block`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blocked: customer.status !== 'blocked'
          }),
        })

        if (response.ok) {
          // Refresh the customers list
          await fetchCustomers()
          setShowMoreActions(null)
          alert(`Customer ${customer.status === 'blocked' ? 'unblocked' : 'blocked'} successfully!`)
        } else {
          alert('Failed to update customer status')
        }
      } catch (error) {
        console.error('Error updating customer status:', error)
        alert('An error occurred while updating customer status')
      }
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const vipCustomers = customers.filter(c => c.status === 'vip').length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Customers</h3>
          <p className="text-muted-foreground">Fetching your customers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Customers</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCustomers}
            className="glass-button px-4 py-2 rounded-lg"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer accounts and information</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCustomers}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Customer</span>
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
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold text-green-500">{activeCustomers}</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
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
              <p className="text-sm text-muted-foreground">VIP Customers</p>
              <p className="text-2xl font-bold text-purple-500">{vipCustomers}</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
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
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-500">৳{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
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
                placeholder="Search customers..."
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

          {selectedCustomers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCustomers.length} selected
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-3 py-1 rounded-lg text-sm"
              >
                Bulk Actions
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-foreground">Contact</th>
                <th className="text-left p-4 font-medium text-foreground">Location</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Orders</th>
                <th className="text-left p-4 font-medium text-foreground">Total Spent</th>
                <th className="text-left p-4 font-medium text-foreground">Rating</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">ID: #{customer.id.substring(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">Joined: {customer.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-foreground">{customer.location || 'Not provided'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      <span className="mr-1">{getStatusIcon(customer.status)}</span>
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-foreground">{customer.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Last: {customer.lastOrder}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">৳{customer.totalSpent.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                      <span className="text-foreground">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewCustomer(customer)}
                        className="glass-button p-2 rounded-lg hover:bg-blue-500/20"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSendEmail(customer)}
                        className="glass-button p-2 rounded-lg hover:bg-green-500/20"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </motion.button>
                      <div className="relative dropdown-container">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMoreActions(customer.id)}
                          className="glass-button p-2 rounded-lg hover:bg-purple-500/20"
                          title="More Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </motion.button>
                        
                        {/* More Actions Dropdown */}
                        {showMoreActions === customer.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-1 w-48 glass-card rounded-lg shadow-lg z-10 dropdown-container"
                          >
                            <div className="p-2">
                              <button
                                onClick={() => handleEditCustomer(customer)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 rounded-lg flex items-center space-x-2"
                              >
                                <UserPlus className="h-4 w-4" />
                                <span>Edit Customer</span>
                              </button>
                              <button
                                onClick={() => handleViewOrders(customer)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 rounded-lg flex items-center space-x-2"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                <span>View Orders</span>
                              </button>
                              <button
                                onClick={() => handleBlockCustomer(customer)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 rounded-lg flex items-center space-x-2 text-red-500"
                              >
                                <span>🚫</span>
                                <span>{customer.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
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
          Showing {filteredCustomers.length} of {customers.length} customers
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

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModals}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {isEditMode ? 'Edit Customer' : 'Customer Details'}
                </h2>
                <div className="flex items-center space-x-2">
                  {!isEditMode && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditMode(true)}
                      className="glass-button px-3 py-2 rounded-lg text-sm hover:bg-blue-500/20"
                    >
                      Edit
                    </motion.button>
                  )}
                  <button
                    onClick={handleCloseModals}
                    className="glass-button p-2 rounded-lg hover:bg-red-500/20"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedCustomer.name}</h3>
                    <p className="text-muted-foreground">ID: #{selectedCustomer.id.substring(0, 8)}...</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                      <span className="mr-1">{getStatusIcon(selectedCustomer.status)}</span>
                      {selectedCustomer.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Information
                    </h4>
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Name</label>
                          <input
                            type="text"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Email</label>
                          <input
                            type="email"
                            value={editFormData.email || ''}
                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                            className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Phone</label>
                          <input
                            type="tel"
                            value={editFormData.phone || ''}
                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                            className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Location</label>
                          <input
                            type="text"
                            value={editFormData.location || ''}
                            onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                            className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{selectedCustomer.location || 'Not provided'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Account Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Joined:</span>
                        <span className="text-sm text-foreground">{selectedCustomer.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Order:</span>
                        <span className="text-sm text-foreground">{selectedCustomer.lastOrder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm text-foreground">{selectedCustomer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Statistics */}
                <div className="glass-card p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Order Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">৳{selectedCustomer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </div>

                {/* Edit Mode Actions */}
                {isEditMode && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditMode(false)}
                      className="glass-button px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveCustomer}
                      className="glass-button px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Send Email Modal */}
      {showEmailModal && selectedCustomer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModals}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Send Email to {selectedCustomer.name}</h2>
                <button
                  onClick={handleCloseModals}
                  className="glass-button p-2 rounded-lg hover:bg-red-500/20"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">To:</label>
                  <input
                    type="email"
                    value={selectedCustomer.email}
                    readOnly
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject:</label>
                  <input
                    type="text"
                    placeholder="Enter email subject"
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message:</label>
                  <textarea
                    rows={6}
                    placeholder="Enter your message here..."
                    className="glass-input w-full px-3 py-2 rounded-lg resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModals}
                    className="glass-button px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    Send Email
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
