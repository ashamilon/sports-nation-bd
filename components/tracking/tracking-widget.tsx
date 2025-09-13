"use client"

import { useState, useEffect } from 'react'
import { Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'

interface TrackingUpdate {
  id: string
  status: string
  location?: string
  description?: string
  timestamp: string
  courierData?: string
}

interface CourierTracking {
  service: string
  trackingId: string
  status: string
  location?: string
  updates: Array<{
    status: string
    location?: string
    timestamp: string
    description?: string
  }>
  estimatedDelivery?: string
  lastUpdated?: string
  error?: string
}

interface TrackingWidgetProps {
  orderId?: string
  trackingNumber?: string
  courierService?: string
  courierTrackingId?: string
}

const statusIcons = {
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  failed_delivery: AlertCircle,
  returned: AlertCircle
}

const statusColors = {
  picked_up: 'text-blue-600 bg-blue-100',
  in_transit: 'text-yellow-600 bg-yellow-100',
  out_for_delivery: 'text-orange-600 bg-orange-100',
  delivered: 'text-green-600 bg-green-100',
  failed_delivery: 'text-red-600 bg-red-100',
  returned: 'text-red-600 bg-red-100'
}

const statusLabels = {
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed_delivery: 'Delivery Failed',
  returned: 'Returned'
}

export default function TrackingWidget({ 
  orderId, 
  trackingNumber, 
  courierService, 
  courierTrackingId 
}: TrackingWidgetProps) {
  const [trackingData, setTrackingData] = useState<any>(null)
  const [courierTracking, setCourierTracking] = useState<CourierTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrackingData()
  }, [orderId, trackingNumber])

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (orderId) params.append('orderId', orderId)
      if (trackingNumber) params.append('trackingNumber', trackingNumber)

      const response = await fetch(`/api/tracking?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data')
      }

      const data = await response.json()
      setTrackingData(data)
      setCourierTracking(data.courierTracking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracking data')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStatus = () => {
    if (courierTracking?.status) {
      return courierTracking.status
    }
    if (trackingData?.trackingUpdates?.[0]?.status) {
      return trackingData.trackingUpdates[0].status
    }
    return 'pending'
  }

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons] || Package
    return <IconComponent className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
  }

  const getStatusLabel = (status: string) => {
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!trackingData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <Package className="w-8 h-8 mx-auto mb-2" />
          <p>No tracking information available</p>
        </div>
      </div>
    )
  }

  const currentStatus = getCurrentStatus()
  const allUpdates = [
    ...(courierTracking?.updates || []),
    ...(trackingData.trackingUpdates || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order Tracking
          </h3>
          <p className="text-sm text-gray-600">
            Order #{trackingData.order.orderNumber}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusLabel(currentStatus)}
        </div>
      </div>

      {/* Courier Information */}
      {trackingData.order.courierService && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {trackingData.order.courierService} Courier
              </h4>
              <p className="text-sm text-gray-600">
                Tracking ID: {trackingData.order.courierTrackingId}
              </p>
            </div>
            {courierTracking?.location && (
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {courierTracking.location}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {courierTracking?.estimatedDelivery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-700">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Estimated Delivery: {formatDate(courierTracking.estimatedDelivery)}
            </span>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tracking History</h4>
        <div className="relative">
          {allUpdates.map((update, index) => {
            const isLatest = index === 0
            const IconComponent = getStatusIcon(update.status)
            
            return (
              <div key={index} className="relative flex items-start pb-4">
                {index < allUpdates.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                )}
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  isLatest ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {IconComponent}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">
                      {getStatusLabel(update.status)}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {formatDate(update.timestamp)}
                    </span>
                  </div>
                  {update.location && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {update.location}
                    </p>
                  )}
                  {update.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {update.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={fetchTrackingData}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Refresh Tracking
        </button>
      </div>
    </div>
  )
}
