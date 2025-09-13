"use client"

import { useState } from 'react'
import { Package, Truck, MapPin, CheckCircle } from 'lucide-react'

interface CourierSelectorProps {
  orderId: string
  currentCourier?: string
  currentTrackingId?: string
  onCourierUpdate: (courierService: string, trackingId: string) => void
}

const courierServices = [
  {
    id: 'sundarban',
    name: 'Sundarban Courier',
    description: 'Reliable nationwide delivery service',
    icon: Package,
    color: 'text-green-600 bg-green-100',
    features: ['Nationwide coverage', 'Real-time tracking', 'Insurance included']
  },
  {
    id: 'pathao',
    name: 'Pathao Courier',
    description: 'Fast local and inter-city delivery',
    icon: Truck,
    color: 'text-blue-600 bg-blue-100',
    features: ['Fast delivery', 'Local expertise', 'Mobile tracking']
  }
]

export default function CourierSelector({ 
  orderId, 
  currentCourier, 
  currentTrackingId,
  onCourierUpdate 
}: CourierSelectorProps) {
  const [selectedCourier, setSelectedCourier] = useState(currentCourier || '')
  const [trackingId, setTrackingId] = useState(currentTrackingId || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourier || !trackingId) {
      setError('Please select a courier service and enter tracking ID')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/courier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courierService: selectedCourier,
          courierTrackingId: trackingId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update courier information')
      }

      const data = await response.json()
      onCourierUpdate(selectedCourier, trackingId)
      setSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update courier information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Package className="w-6 h-6 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Assign Courier Service
        </h3>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Courier service assigned successfully!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Courier Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Courier Service
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courierServices.map((service) => {
              const IconComponent = service.icon
              const isSelected = selectedCourier === service.id
              
              return (
                <div
                  key={service.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCourier(service.id)}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${service.color} mr-3`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-xs text-gray-500 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tracking ID Input */}
        <div>
          <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
            Tracking ID
          </label>
          <input
            type="text"
            id="trackingId"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter courier tracking ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the tracking ID provided by the courier service
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !selectedCourier || !trackingId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 mr-2" />
                Assign Courier
              </>
            )}
          </button>
        </div>
      </form>

      {/* Current Status */}
      {currentCourier && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Current Courier</h4>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                courierServices.find(s => s.id === currentCourier)?.color || 'text-gray-600 bg-gray-100'
              } mr-3`}>
                {(() => {
                  const service = courierServices.find(s => s.id === currentCourier)
                  const IconComponent = service?.icon || Package
                  return <IconComponent className="w-4 h-4" />
                })()}
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {currentCourier} Courier
                </p>
                <p className="text-sm text-gray-600">
                  ID: {currentTrackingId}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
