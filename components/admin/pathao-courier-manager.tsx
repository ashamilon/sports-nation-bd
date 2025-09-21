"use client"

import { useState, useEffect } from 'react'
import { Package, Truck, MapPin, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface PathaoCourierManagerProps {
  orderId: string
  orderData: {
    orderNumber: string
    total: number
    shippingAddress: string
    customerName: string
    customerPhone: string
    customerEmail: string
    items: Array<{
      name: string
      quantity: number
      price: number
      weight?: number
    }>
  }
  currentCourier?: string
  currentTrackingId?: string
  onCourierUpdate: (courierService: string, trackingId: string) => void
}

interface PathaoCity {
  city_id: number
  city_name: string
  zone_list: PathaoZone[]
}

interface PathaoZone {
  zone_id: number
  zone_name: string
  area_list: PathaoArea[]
}

interface PathaoArea {
  area_id: number
  area_name: string
}

interface PathaoDeliveryCost {
  delivery_type_id: number
  delivery_type_name: string
  cost: number
  delivery_time: string
}

const deliveryTypes = [
  { id: '48', name: 'Standard (48 hours)', cost: 0, description: 'Regular delivery within 48 hours' },
  { id: '24', name: 'Express (24 hours)', cost: 30, description: 'Fast delivery within 24 hours' },
  { id: '12', name: 'Same Day', cost: 50, description: 'Same day delivery (if ordered before 2 PM)' }
]

export default function PathaoCourierManager({ 
  orderId, 
  orderData,
  currentCourier, 
  currentTrackingId,
  onCourierUpdate 
}: PathaoCourierManagerProps) {
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('48')
  const [specialInstruction, setSpecialInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderStatus, setOrderStatus] = useState<any>(null)
  
  // Location data
  const [cities, setCities] = useState<PathaoCity[]>([])
  const [zones, setZones] = useState<PathaoZone[]>([])
  const [areas, setAreas] = useState<PathaoArea[]>([])
  const [deliveryCosts, setDeliveryCosts] = useState<PathaoDeliveryCost[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  // Load cities on component mount
  useEffect(() => {
    loadCities()
  }, [])

  // Load zones when city is selected
  useEffect(() => {
    if (selectedCity) {
      loadZones(selectedCity)
      setSelectedZone(null)
      setSelectedArea(null)
      setDeliveryCosts([])
    }
  }, [selectedCity])

  // Load areas when zone is selected
  useEffect(() => {
    if (selectedZone) {
      loadAreas(selectedZone)
      setSelectedArea(null)
      setDeliveryCosts([])
    }
  }, [selectedZone])

  // Calculate delivery cost when area is selected
  useEffect(() => {
    if (selectedCity && selectedZone && selectedArea) {
      calculateDeliveryCost()
    }
  }, [selectedCity, selectedZone, selectedArea])

  const loadCities = async () => {
    try {
      setLoadingLocations(true)
      const response = await fetch('/api/courier/pathao/locations?type=cities')
      const data = await response.json()
      
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error('Error loading cities:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const loadZones = async (cityId: number) => {
    try {
      setLoadingLocations(true)
      const response = await fetch(`/api/courier/pathao/locations?type=zones&cityId=${cityId}`)
      const data = await response.json()
      
      if (data.success) {
        setZones(data.data)
      }
    } catch (error) {
      console.error('Error loading zones:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const loadAreas = async (zoneId: number) => {
    try {
      setLoadingLocations(true)
      const response = await fetch(`/api/courier/pathao/locations?type=areas&zoneId=${zoneId}`)
      const data = await response.json()
      
      if (data.success) {
        setAreas(data.data)
      }
    } catch (error) {
      console.error('Error loading areas:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const calculateDeliveryCost = async () => {
    if (!selectedCity || !selectedZone || !selectedArea) return

    try {
      setLoadingLocations(true)
      const response = await fetch('/api/courier/pathao/cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cityId: selectedCity,
          zoneId: selectedZone,
          areaId: selectedArea,
          weight: 0.5 // Default weight
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDeliveryCosts(data.data)
      }
    } catch (error) {
      console.error('Error calculating delivery cost:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleCreatePathaoOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCity || !selectedZone || !selectedArea) {
      setError('Please select city, zone, and area')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const courierData = {
        cityId: selectedCity,
        zoneId: selectedZone,
        areaId: selectedArea,
        deliveryType: selectedDeliveryType,
        specialInstruction: specialInstruction
      }

      const response = await fetch('/api/courier/pathao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          courierData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Pathao order')
      }

      if (data.success) {
        onCourierUpdate('pathao', data.data.pathaoResponse.tracking_code)
        setSuccess(true)
        toast.success('Pathao order created successfully!')
        
        // Reset form after success
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        throw new Error(data.message || 'Failed to create Pathao order')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create Pathao order'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckStatus = async () => {
    if (!currentTrackingId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/courier/pathao?trackingId=${currentTrackingId}`)
      const data = await response.json()

      if (data.success) {
        setOrderStatus(data.data)
        toast.success('Order status updated')
      } else {
        throw new Error(data.error || 'Failed to get order status')
      }
    } catch (err) {
      toast.error('Failed to check order status')
    } finally {
      setLoading(false)
    }
  }

  const selectedCityData = cities.find(c => c.city_id === selectedCity)
  const selectedZoneData = zones.find(z => z.zone_id === selectedZone)
  const selectedAreaData = areas.find(a => a.area_id === selectedArea)
  const selectedDeliveryData = deliveryTypes.find(d => d.id === selectedDeliveryType)
  
  // Get cost from Pathao API response
  const pathaoDeliveryCost = deliveryCosts.find(cost => 
    cost.delivery_type_id.toString() === selectedDeliveryType
  )
  const totalDeliveryCost = pathaoDeliveryCost?.cost || 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pathao Courier Management
          </h3>
          <p className="text-sm text-gray-600">
            Create and manage Pathao delivery orders
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Pathao order created successfully!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Order Number:</span>
            <span className="ml-2 font-medium">{orderData.orderNumber}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <span className="ml-2 font-medium">৳{orderData.total}</span>
          </div>
          <div>
            <span className="text-gray-600">Customer:</span>
            <span className="ml-2 font-medium">{orderData.customerName}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <span className="ml-2 font-medium">{orderData.customerPhone}</span>
          </div>
        </div>
      </div>

      {currentCourier === 'pathao' && currentTrackingId ? (
        /* Current Pathao Order Status */
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Active Pathao Order</h4>
                  <p className="text-sm text-gray-600">Tracking ID: {currentTrackingId}</p>
                </div>
              </div>
              <button
                onClick={handleCheckStatus}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>

          {orderStatus && (
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Order Status</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{orderStatus.status || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{orderStatus.location || 'Unknown'}</span>
                </div>
                {orderStatus.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {new Date(orderStatus.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Create New Pathao Order */
        <form onSubmit={handleCreatePathaoOrder} className="space-y-6">
          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                value={selectedCity || ''}
                onChange={(e) => setSelectedCity(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingLocations}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone *
              </label>
              <select
                value={selectedZone || ''}
                onChange={(e) => setSelectedZone(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCity || loadingLocations}
              >
                <option value="">Select Zone</option>
                {zones.map((zone) => (
                  <option key={zone.zone_id} value={zone.zone_id}>
                    {zone.zone_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <select
                value={selectedArea || ''}
                onChange={(e) => setSelectedArea(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedZone || loadingLocations}
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

          {/* Delivery Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Type
            </label>
            <div className="space-y-2">
              {deliveryTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedDeliveryType === type.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDeliveryType(type.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {type.cost > 0 ? `+৳${type.cost}` : 'Free'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="specialInstruction" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstruction"
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              placeholder="Any special delivery instructions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Delivery Cost Summary */}
          {selectedCity && selectedZone && selectedArea && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Cost Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span>{selectedCityData?.city_name}, {selectedZoneData?.zone_name}, {selectedAreaData?.area_name}</span>
                </div>
                {pathaoDeliveryCost && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Type:</span>
                      <span>{pathaoDeliveryCost.delivery_type_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span>{pathaoDeliveryCost.delivery_time}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total Delivery Cost:</span>
                      <span>৳{pathaoDeliveryCost.cost}</span>
                    </div>
                  </>
                )}
                {loadingLocations && (
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                    <span className="ml-2">Calculating cost...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedCity || !selectedZone || !selectedArea}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Order...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Create Pathao Order
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
