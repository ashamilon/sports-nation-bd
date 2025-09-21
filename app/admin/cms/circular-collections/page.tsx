"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import toast from 'react-hot-toast'
import { Package, Eye, EyeOff, ArrowUp, ArrowDown, Settings, RotateCcw } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  isInCarousel?: boolean
  carouselOrder?: number
}

interface CarouselSettings {
  isEnabled: boolean
  maxItems: number
  autoRotate: boolean
  rotationSpeed: number
}

export default function CircularCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [carouselSettings, setCarouselSettings] = useState<CarouselSettings>({
    isEnabled: true,
    maxItems: 6,
    autoRotate: true,
    rotationSpeed: 20
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [collectionsRes, settingsRes] = await Promise.all([
        fetch(`/api/collections?isActive=true&_t=${Date.now()}`, {
          cache: 'no-store'
        }),
        fetch(`/api/cms/circular-collections/settings?_t=${Date.now()}`, {
          cache: 'no-store'
        })
      ])

      const collectionsData = await collectionsRes.json()
      const settingsData = await settingsRes.json()

      if (collectionsData.success) {
        setCollections(collectionsData.data)
      }

      if (settingsData.success) {
        setCarouselSettings(settingsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCarousel = async (collectionId: string, isInCarousel: boolean) => {
    try {
      const response = await fetch(`/api/cms/circular-collections/${collectionId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ isInCarousel: !isInCarousel })
      })

      if (!response.ok) throw new Error('Failed to update collection')

      // Refresh data to ensure we have the latest state
      await fetchData()

      toast.success(`Collection ${!isInCarousel ? 'added to' : 'removed from'} carousel`)
    } catch (error) {
      toast.error('Failed to update collection')
    }
  }

  const handleReorder = async (collectionId: string, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/cms/circular-collections/${collectionId}/reorder`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ direction })
      })

      if (!response.ok) throw new Error('Failed to reorder collection')

      // Refresh data to get updated order
      await fetchData()
      toast.success('Collection order updated')
    } catch (error) {
      toast.error('Failed to reorder collection')
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/cms/circular-collections/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(carouselSettings)
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleResetOrder = async () => {
    try {
      const response = await fetch('/api/cms/circular-collections/reset-order', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) throw new Error('Failed to reset order')

      await fetchData()
      toast.success('Collection order reset to default')
    } catch (error) {
      toast.error('Failed to reset order')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading collections...</div>
        </div>
      </AdminLayout>
    )
  }

  const carouselCollections = collections.filter(c => c.isInCarousel).sort((a, b) => (a.carouselOrder || 0) - (b.carouselOrder || 0))
  const availableCollections = collections.filter(c => !c.isInCarousel)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Circular Collections Carousel</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleResetOrder}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Order</span>
            </button>
            <button
              onClick={fetchData}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Carousel Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enable Carousel</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={carouselSettings.isEnabled}
                  onChange={(e) => setCarouselSettings(prev => ({ ...prev, isEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {carouselSettings.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Items</label>
              <input
                type="number"
                min="3"
                max="12"
                value={carouselSettings.maxItems}
                onChange={(e) => setCarouselSettings(prev => ({ ...prev, maxItems: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto Rotate</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={carouselSettings.autoRotate}
                  onChange={(e) => setCarouselSettings(prev => ({ ...prev, autoRotate: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {carouselSettings.autoRotate ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Speed (seconds)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={carouselSettings.rotationSpeed}
                onChange={(e) => setCarouselSettings(prev => ({ ...prev, rotationSpeed: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Carousel Collections */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Collections in Carousel ({carouselCollections.length})
          </h2>
          
          {carouselCollections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No collections in carousel yet</p>
              <p className="text-sm">Add collections from the available list below</p>
            </div>
          ) : (
            <div className="space-y-3">
              {carouselCollections.map((collection, index) => (
                <div key={collection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{collection.name}</h3>
                      <p className="text-sm text-gray-500">Order: {index + 1}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(collection.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(collection.id, 'down')}
                      disabled={index === carouselCollections.length - 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleCarousel(collection.id, true)}
                      className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                    >
                      <EyeOff className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Collections */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Collections ({availableCollections.length})
          </h2>
          
          {availableCollections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>All collections are already in the carousel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCollections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{collection.name}</h3>
                      <p className="text-sm text-gray-500">{collection.slug}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleCarousel(collection.id, false)}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Carousel Preview</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex space-x-4 overflow-x-auto">
              {carouselCollections.slice(0, carouselSettings.maxItems).map((collection, index) => (
                <div key={collection.id} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    {collection.image ? (
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-600">{collection.name}</p>
                </div>
              ))}
            </div>
            {carouselCollections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Add collections to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
