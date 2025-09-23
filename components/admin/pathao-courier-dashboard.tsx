"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Store, 
  MapPin, 
  Package, 
  Calculator,
  Plus,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Users,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'
import PathaoOrderForm from './pathao-order-form'
import PathaoOrdersList from './pathao-orders-list'
import PathaoManualOrders from './pathao-manual-orders'

interface PathaoStore {
  store_id: string
  store_name: string
  store_address: string
  is_active: number
  city_id: string
  zone_id: string
  hub_id: string
  is_default_store: boolean
  is_default_return_store: boolean
}

interface PathaoCity {
  city_id: number
  city_name: string
}

interface PathaoZone {
  zone_id: number
  zone_name: string
}

interface PathaoArea {
  area_id: number
  area_name: string
  home_delivery_available: boolean
  pickup_available: boolean
}

interface PathaoOrder {
  store_id: number
  merchant_order_id?: string
  recipient_name: string
  recipient_phone: string
  recipient_secondary_phone?: string
  recipient_address: string
  recipient_city?: number
  recipient_zone?: number
  recipient_area?: number
  delivery_type: number
  item_type: number
  special_instruction?: string
  item_quantity: number
  item_weight: number
  item_description?: string
  amount_to_collect: number
}

export default function PathaoCourierDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<PathaoStore[]>([])
  const [cities, setCities] = useState<PathaoCity[]>([])
  const [zones, setZones] = useState<PathaoZone[]>([])
  const [areas, setAreas] = useState<PathaoArea[]>([])
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [priceData, setPriceData] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedOrderForPrefill, setSelectedOrderForPrefill] = useState<any>(null)
  const [settings, setSettings] = useState({
    environment: 'sandbox',
    clientId: '',
    clientSecret: '',
    username: '',
    password: ''
  })

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Truck },
    { id: 'stores', name: 'Stores', icon: Store },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'calculator', name: 'Price Calculator', icon: Calculator },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  // Test connection
  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pathao/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-connection' })
      })
      
      const data = await response.json()
      if (data.success) {
        setConnectionStatus('connected')
        toast.success('Connection successful!')
      } else {
        setConnectionStatus('disconnected')
        toast.error('Connection failed')
      }
    } catch (error) {
      setConnectionStatus('disconnected')
      toast.error('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  // Load stores
  const loadStores = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pathao/stores')
      const data = await response.json()
      if (data.success) {
        setStores(data.data)
      } else {
        toast.error('Failed to load stores')
      }
    } catch (error) {
      toast.error('Failed to load stores')
    } finally {
      setLoading(false)
    }
  }

  // Load cities
  const loadCities = async () => {
    try {
      const response = await fetch('/api/pathao/locations?type=cities')
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error('Failed to load cities:', error)
    }
  }

  // Load zones when city changes
  const loadZones = async (cityId: number) => {
    try {
      const response = await fetch(`/api/pathao/locations?type=zones&cityId=${cityId}`)
      const data = await response.json()
      if (data.success) {
        setZones(data.data)
        setSelectedZone(null)
        setAreas([])
      }
    } catch (error) {
      console.error('Failed to load zones:', error)
    }
  }

  // Load areas when zone changes
  const loadAreas = async (zoneId: number) => {
    try {
      const response = await fetch(`/api/pathao/locations?type=areas&zoneId=${zoneId}`)
      const data = await response.json()
      if (data.success) {
        setAreas(data.data)
        setSelectedArea(null)
      }
    } catch (error) {
      console.error('Failed to load areas:', error)
    }
  }

  // Calculate price
  const calculatePrice = async (orderData: any) => {
    try {
      const response = await fetch('/api/pathao/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate-price',
          ...orderData
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setPriceData(data.data)
      } else {
        toast.error('Failed to calculate price')
      }
    } catch (error) {
      toast.error('Failed to calculate price')
    }
  }

  // Load settings on component mount
  const loadSettings = async () => {
    try {
      const response = await fetch('/api/pathao/settings', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setSettings({
          environment: data.data.environment || 'sandbox',
          clientId: data.data.clientId || '',
          clientSecret: '', // Don't load secret for security
          username: data.data.username || '',
          password: '' // Don't load password for security
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Set default sandbox settings
      setSettings({
        environment: 'sandbox',
        clientId: '',
        clientSecret: '',
        username: '',
        password: ''
      })
    }
  }

  // Save settings
  const saveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pathao/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('Settings saved successfully! Please restart the server to apply changes.')
        // Test connection with new settings
        await testConnection()
      } else {
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await loadCities()
      await loadSettings()
      await testConnection()
    }
    initialize()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      loadZones(selectedCity)
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedZone) {
      loadAreas(selectedZone)
    }
  }, [selectedZone])

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Connection Status</h3>
          <button
            onClick={testConnection}
            disabled={loading}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>Test Connection</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {connectionStatus === 'connected' ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : connectionStatus === 'disconnected' ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-500" />
          )}
          <span className={`font-medium ${
            connectionStatus === 'connected' ? 'text-green-600' :
            connectionStatus === 'disconnected' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'disconnected' ? 'Disconnected' : 'Unknown'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Stores</p>
              <p className="text-2xl font-bold text-foreground">{stores.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Orders Today</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Delivery Fee</p>
              <p className="text-2xl font-bold text-foreground">
                {priceData ? `৳${priceData.final_price}` : '৳0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  )

  const renderStores = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Stores Management</h3>
        <button
          onClick={loadStores}
          disabled={loading}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span>Refresh</span>
        </button>
      </div>

      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.store_id} className="glass-card p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{store.store_name}</h4>
                  <p className="text-sm text-muted-foreground">ID: {store.store_id}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  store.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {store.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{store.store_address}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>City: {store.city_id}</span>
                <span>Zone: {store.zone_id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No stores found</p>
          <button
            onClick={loadStores}
            className="mt-4 glass-button px-4 py-2 rounded-lg"
          >
            Load Stores
          </button>
        </div>
      )}
    </div>
  )

  const renderPriceCalculator = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Price Calculator</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="glass-card p-6 rounded-lg">
          <h4 className="font-semibold text-foreground mb-4">Calculate Delivery Fee</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Store ID
              </label>
              <input
                type="number"
                placeholder="Enter store ID"
                className="glass-input w-full px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Type
              </label>
              <select className="glass-input w-full px-4 py-2 rounded-lg">
                <option value="1">Document</option>
                <option value="2">Parcel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Type
              </label>
              <select className="glass-input w-full px-4 py-2 rounded-lg">
                <option value="48">Normal Delivery</option>
                <option value="12">On Demand Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Weight (KG)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                placeholder="0.5"
                className="glass-input w-full px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <select
                value={selectedCity || ''}
                onChange={(e) => setSelectedCity(parseInt(e.target.value))}
                className="glass-input w-full px-4 py-2 rounded-lg"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCity && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Zone
                </label>
                <select
                  value={selectedZone || ''}
                  onChange={(e) => setSelectedZone(parseInt(e.target.value))}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.zone_id} value={zone.zone_id}>
                      {zone.zone_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                // Calculate price logic here
                toast.info('Price calculation feature coming soon!')
              }}
              className="w-full glass-button px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Calculate Price
            </button>
          </div>
        </div>

        {/* Price Result */}
        <div className="glass-card p-6 rounded-lg">
          <h4 className="font-semibold text-foreground mb-4">Price Breakdown</h4>
          
          {priceData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price:</span>
                <span className="font-medium">৳{priceData.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-green-600">-৳{priceData.discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Additional Charge:</span>
                <span className="font-medium">৳{priceData.additional_charge}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Final Price:</span>
                <span className="text-primary">৳{priceData.final_price}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter details to calculate price</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const handleOrderSelect = (order: any) => {
    setSelectedOrderForPrefill(order)
    setShowOrderForm(true)
  }

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Order Management</h3>
        <button 
          onClick={() => {
            setSelectedOrderForPrefill(null)
            setShowOrderForm(true)
          }}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Order</span>
        </button>
      </div>

      <PathaoManualOrders />

      <PathaoOrdersList 
        onOrderSelect={handleOrderSelect}
        selectedOrderId={selectedOrderForPrefill?.id}
      />
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Pathao Settings</h3>
      
      <div className="glass-card p-6 rounded-lg">
        <h4 className="font-semibold text-foreground mb-4">API Configuration</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Environment
            </label>
            <select 
              value={settings.environment}
              onChange={(e) => setSettings(prev => ({ ...prev, environment: e.target.value }))}
              className="glass-input w-full px-4 py-2 rounded-lg"
            >
              <option value="sandbox">Sandbox (Test)</option>
              <option value="production">Production (Live)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client ID
            </label>
            <input
              type="text"
              value={settings.clientId}
              onChange={(e) => setSettings(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="Your Pathao Client ID"
              className="glass-input w-full px-4 py-2 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client Secret
            </label>
            <input
              type="password"
              value={settings.clientSecret}
              onChange={(e) => setSettings(prev => ({ ...prev, clientSecret: e.target.value }))}
              placeholder="Your Pathao Client Secret"
              className="glass-input w-full px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username/Email
            </label>
            <input
              type="email"
              value={settings.username}
              onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Your Pathao login email"
              className="glass-input w-full px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={settings.password}
              onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Your Pathao password"
              className="glass-input w-full px-4 py-2 rounded-lg"
            />
          </div>
          
          <button 
            onClick={saveSettings}
            disabled={loading}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Save Settings</span>
          </button>
          
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p><strong>Note:</strong> After saving settings, you'll need to restart the development server for the changes to take effect.</p>
          </div>
        </div>
      </div>

      {/* Current Configuration Display */}
      <div className="glass-card p-6 rounded-lg">
        <h4 className="font-semibold text-foreground mb-4">Current Configuration</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment:</span>
            <span className="font-medium">{settings.environment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client ID:</span>
            <span className="font-medium">{settings.clientId ? `${settings.clientId.substring(0, 8)}...` : 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Username:</span>
            <span className="font-medium">{settings.username || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Connection Status:</span>
            <span className={`font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' :
              connectionStatus === 'disconnected' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'disconnected' ? 'Disconnected' : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'stores':
        return renderStores()
      case 'orders':
        return renderOrders()
      case 'calculator':
        return renderPriceCalculator()
      case 'settings':
        return renderSettings()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Truck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pathao Courier</h1>
          <p className="text-muted-foreground">Manage courier orders and deliveries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <PathaoOrderForm
          onClose={() => {
            setShowOrderForm(false)
            setSelectedOrderForPrefill(null)
          }}
          onOrderCreated={(order) => {
            toast.success(`Order created successfully! Consignment ID: ${order.consignment_id}`)
            // You can add logic here to refresh orders list or update UI
          }}
          prefillData={selectedOrderForPrefill}
        />
      )}
    </div>
  )
}