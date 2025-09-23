"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Weight, 
  DollarSign,
  Send,
  Loader2,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface PathaoOrderFormProps {
  onClose: () => void
  onOrderCreated?: (order: any) => void
  prefillData?: any
}

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

export default function PathaoOrderForm({ onClose, onOrderCreated, prefillData }: PathaoOrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<PathaoStore[]>([])
  const [cities, setCities] = useState<PathaoCity[]>([])
  const [zones, setZones] = useState<PathaoZone[]>([])
  const [areas, setAreas] = useState<PathaoArea[]>([])
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [priceData, setPriceData] = useState<any>(null)

  const [formData, setFormData] = useState({
    store_id: '',
    merchant_order_id: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_secondary_phone: '',
    recipient_address: '',
    recipient_city: '',
    recipient_zone: '',
    recipient_area: '',
    delivery_type: 48,
    item_type: 2,
    special_instruction: '',
    item_quantity: 1,
    item_weight: 0.5,
    item_description: '',
    amount_to_collect: 0
  })

  // Load initial data
  useEffect(() => {
    loadStores()
    loadCities()
  }, [])

  // Prefill form data if provided
  useEffect(() => {
    if (prefillData) {
      setFormData({
        store_id: prefillData.storeId?.toString() || '',
        merchant_order_id: prefillData.merchantOrderId || '',
        recipient_name: prefillData.recipientName || '',
        recipient_phone: prefillData.recipientPhone || '',
        recipient_secondary_phone: prefillData.recipientSecondaryPhone || '',
        recipient_address: prefillData.recipientAddress || '',
        recipient_city: prefillData.recipientCity?.toString() || '',
        recipient_zone: prefillData.recipientZone?.toString() || '',
        recipient_area: prefillData.recipientArea?.toString() || '',
        delivery_type: prefillData.deliveryType || 48,
        item_type: prefillData.itemType || 2,
        special_instruction: prefillData.specialInstruction || '',
        item_quantity: prefillData.itemQuantity || 1,
        item_weight: prefillData.itemWeight || 0.5,
        item_description: prefillData.itemDescription || '',
        amount_to_collect: prefillData.amountToCollect || 0
      })

      // Set location selections
      if (prefillData.recipientCity) {
        setSelectedCity(prefillData.recipientCity)
      }
      if (prefillData.recipientZone) {
        setSelectedZone(prefillData.recipientZone)
      }
      if (prefillData.recipientArea) {
        setSelectedArea(prefillData.recipientArea)
      }
    }
  }, [prefillData])

  // Load zones when city changes
  useEffect(() => {
    if (selectedCity) {
      loadZones(selectedCity)
      setFormData(prev => ({ ...prev, recipient_city: selectedCity.toString() }))
    }
  }, [selectedCity])

  // Load areas when zone changes
  useEffect(() => {
    if (selectedZone) {
      loadAreas(selectedZone)
      setFormData(prev => ({ ...prev, recipient_zone: selectedZone.toString() }))
    }
  }, [selectedZone])

  // Update form data when area changes
  useEffect(() => {
    if (selectedArea) {
      setFormData(prev => ({ ...prev, recipient_area: selectedArea.toString() }))
    }
  }, [selectedArea])

  const loadStores = async () => {
    try {
      const response = await fetch('/api/pathao/stores')
      const data = await response.json()
      if (data.success) {
        setStores(data.data)
        if (data.data.length > 0) {
          setFormData(prev => ({ ...prev, store_id: data.data[0].store_id }))
        }
      }
    } catch (error) {
      console.error('Failed to load stores:', error)
    }
  }

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

  const calculatePrice = async () => {
    if (!formData.store_id || !selectedCity || !selectedZone) {
      toast.error('Please fill in store, city, and zone to calculate price')
      return
    }

    try {
      const response = await fetch('/api/pathao/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate-price',
          store_id: parseInt(formData.store_id),
          item_type: formData.item_type,
          delivery_type: formData.delivery_type,
          item_weight: formData.item_weight,
          recipient_city: selectedCity,
          recipient_zone: selectedZone
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setPriceData(data.data)
        toast.success('Price calculated successfully!')
      } else {
        toast.error('Failed to calculate price')
      }
    } catch (error) {
      toast.error('Failed to calculate price')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        store_id: parseInt(formData.store_id),
        recipient_city: selectedCity,
        recipient_zone: selectedZone,
        recipient_area: selectedArea,
        delivery_type: formData.delivery_type,
        item_type: formData.item_type,
        item_quantity: formData.item_quantity,
        item_weight: formData.item_weight,
        amount_to_collect: formData.amount_to_collect
      }

      const response = await fetch('/api/pathao/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...orderData
        })
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('Order created successfully!')
        onOrderCreated?.(data.data)
        onClose()
      } else {
        toast.error(data.error || 'Failed to create order')
      }
    } catch (error) {
      toast.error('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Create Pathao Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Store <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.store_id}
                onChange={(e) => handleInputChange('store_id', e.target.value)}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Store</option>
                {stores.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Merchant Order ID */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Merchant Order ID
              </label>
              <input
                type="text"
                value={formData.merchant_order_id}
                onChange={(e) => handleInputChange('merchant_order_id', e.target.value)}
                placeholder="Your order reference"
                className="glass-input w-full px-4 py-2 rounded-lg"
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.recipient_name}
                onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                placeholder="Full name"
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            {/* Recipient Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Recipient Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.recipient_phone}
                onChange={(e) => handleInputChange('recipient_phone', e.target.value)}
                placeholder="017XXXXXXXX"
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Secondary Phone
              </label>
              <input
                type="tel"
                value={formData.recipient_secondary_phone}
                onChange={(e) => handleInputChange('recipient_secondary_phone', e.target.value)}
                placeholder="015XXXXXXXX"
                className="glass-input w-full px-4 py-2 rounded-lg"
              />
            </div>

            {/* Delivery Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.delivery_type}
                onChange={(e) => handleInputChange('delivery_type', parseInt(e.target.value))}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              >
                <option value={48}>Normal Delivery</option>
                <option value={12}>On Demand Delivery</option>
              </select>
            </div>

            {/* Item Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.item_type}
                onChange={(e) => handleInputChange('item_type', parseInt(e.target.value))}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              >
                <option value={1}>Document</option>
                <option value={2}>Parcel</option>
              </select>
            </div>

            {/* Item Quantity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.item_quantity}
                onChange={(e) => handleInputChange('item_quantity', parseInt(e.target.value))}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            {/* Item Weight */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Weight (KG) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                value={formData.item_weight}
                onChange={(e) => handleInputChange('item_weight', parseFloat(e.target.value))}
                className="glass-input w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            {/* Amount to Collect */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount to Collect (৳)
              </label>
              <input
                type="number"
                min="0"
                value={formData.amount_to_collect}
                onChange={(e) => handleInputChange('amount_to_collect', parseInt(e.target.value) || 0)}
                placeholder="0 for non-COD"
                className="glass-input w-full px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Delivery Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(parseInt(e.target.value))}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedZone || ''}
                  onChange={(e) => setSelectedZone(parseInt(e.target.value))}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  required
                  disabled={!selectedCity}
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.zone_id} value={zone.zone_id}>
                      {zone.zone_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Area
                </label>
                <select
                  value={selectedArea || ''}
                  onChange={(e) => setSelectedArea(parseInt(e.target.value))}
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  disabled={!selectedZone}
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area.area_id} value={area.area_id}>
                      {area.area_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.recipient_address}
                onChange={(e) => handleInputChange('recipient_address', e.target.value)}
                placeholder="House 123, Road 4, Sector 10, Uttara, Dhaka-1230, Bangladesh"
                className="glass-input w-full px-4 py-2 rounded-lg"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Description
              </label>
              <textarea
                value={formData.item_description}
                onChange={(e) => handleInputChange('item_description', e.target.value)}
                placeholder="Describe the item being shipped"
                className="glass-input w-full px-4 py-2 rounded-lg"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.special_instruction}
                onChange={(e) => handleInputChange('special_instruction', e.target.value)}
                placeholder="Any special delivery instructions"
                className="glass-input w-full px-4 py-2 rounded-lg"
                rows={2}
              />
            </div>
          </div>

          {/* Price Calculator */}
          {priceData && (
            <div className="glass-card p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Delivery Fee</h4>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated delivery fee:</span>
                <span className="text-lg font-bold text-primary">৳{priceData.final_price}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              type="button"
              onClick={calculatePrice}
              disabled={!formData.store_id || !selectedCity || !selectedZone}
              className="glass-button px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <DollarSign className="h-4 w-4" />
              <span>Calculate Price</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-button px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{loading ? 'Creating...' : 'Create Order'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
