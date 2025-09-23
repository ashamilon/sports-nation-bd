"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Home, 
  Building,
  Check,
  X
} from 'lucide-react'

interface Address {
  id: number
  type: 'home' | 'work' | 'other'
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: 'home',
      name: 'Home Address',
      address: '123 Main Street, Dhanmondi',
      city: 'Dhaka',
      postalCode: '1205',
      country: 'Bangladesh',
      phone: '+880 1647 429992',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Office Address',
      address: '456 Business District, Gulshan',
      city: 'Dhaka',
      postalCode: '1212',
      country: 'Bangladesh',
      phone: '+880 9876 543210',
      isDefault: false
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    phone: '',
    isDefault: false
  })

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />
      case 'work':
        return <Building className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'work':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400'
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id }
          : addr
      ))
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData,
        id: Date.now()
      }
      setAddresses(prev => [...prev, newAddress])
    }

    setIsLoading(false)
    setShowAddForm(false)
    setEditingAddress(null)
    resetForm()
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    })
    setEditingAddress(address)
    setShowAddForm(true)
  }

  const handleDelete = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Bangladesh',
      phone: '',
      isDefault: false
    })
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingAddress(null)
    resetForm()
  }

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Address Book</h1>
          <p className="text-muted-foreground mt-2">Manage your shipping and billing addresses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Address</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={handleCancel}
              className="glass-button p-2 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'home' | 'work' | 'other')}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Home Address"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Street Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your full address"
                rows={3}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+880 1647 429992"
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-foreground">
                Set as default address
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="glass-button px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="glass-button px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getAddressTypeColor(address.type)}`}>
                  {getAddressIcon(address.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{address.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAddressTypeColor(address.type)}`}>
                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {address.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </span>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="glass-button p-2 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="glass-button p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{address.address}</p>
              <p>{address.city}, {address.postalCode}</p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </div>

            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="mt-4 glass-button px-4 py-2 rounded-lg text-sm"
              >
                Set as Default
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {addresses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">
            Add your first address to make checkout faster and easier.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="glass-button px-6 py-3 rounded-lg"
          >
            Add Your First Address
          </button>
        </motion.div>
      )}
    </div>
  )
}
