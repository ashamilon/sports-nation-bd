"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import toast from 'react-hot-toast'
import { Package, Eye, EyeOff, PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  _count?: {
    CollectionProduct: number
  }
}

interface HomepageCollectionSetting {
  id: string
  collectionId: string
  isVisible: boolean
  sortOrder: number
  Collection: Collection
}

export default function HomepageCollectionsCMSPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [homepageSettings, setHomepageSettings] = useState<HomepageCollectionSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/cms/homepage-collections?_t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await response.json()
      if (data.success) {
        // Handle the API response structure
        const collectionsData = data.data?.collections || []
        const settingsData = data.data?.settings || []
        
        setCollections(collectionsData)
        setHomepageSettings(settingsData)
        
        // Set selected collections from existing settings
        const selectedIds = settingsData.map((setting: HomepageCollectionSetting) => setting.collectionId)
        setSelectedCollections(selectedIds)
        
        // Set visibility from first setting (all should be the same)
        if (settingsData.length > 0) {
          setIsVisible(settingsData[0].isVisible)
        } else {
          setIsVisible(true)
        }
      } else {
        toast.error(data.error || 'Failed to fetch collections')
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleSaveSettings = async () => {
    try {
      // Validate that all selected collections are active
      const inactiveSelected = selectedCollections.filter(collectionId => {
        const collection = collections.find(c => c.id === collectionId)
        return collection && !collection.isActive
      })
      
      if (inactiveSelected.length > 0) {
        toast.error('Cannot select inactive collections for homepage display. Please activate them first or remove them from selection.')
        return
      }

      const response = await fetch('/api/cms/homepage-collections', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          collectionIds: selectedCollections,
          isVisible
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to save settings')
      }
      
      toast.success('Homepage collection settings saved successfully!')
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
      console.error(error)
    }
  }

  const moveCollection = (index: number, direction: 'up' | 'down') => {
    const newSelected = [...selectedCollections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newSelected.length) {
      [newSelected[index], newSelected[newIndex]] = [newSelected[newIndex], newSelected[index]]
      setSelectedCollections(newSelected)
    }
  }

  const getSelectedCollectionDetails = () => {
    if (!collections || !Array.isArray(collections)) return []
    return selectedCollections.map(collectionId => 
      collections.find(collection => collection.id === collectionId)
    ).filter(Boolean) as Collection[]
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Homepage Collections Management</h1>
            <p className="text-muted-foreground mt-1">
              Select which collections appear in the homepage collection section
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <Check className="h-5 w-5 mr-2" /> Save Settings
          </Button>
        </div>

        {/* Visibility Toggle */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Section Visibility</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Control whether the homepage collection section is visible to visitors
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVisible(!isVisible)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isVisible 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {isVisible ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Hidden</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Available Collections */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Available Collections</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showInactive"
                checked={showInactive}
                onCheckedChange={(checked) => setShowInactive(checked as boolean)}
              />
              <label htmlFor="showInactive" className="text-sm text-muted-foreground">
                Show inactive collections
              </label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Select which collections should appear in the homepage collection section
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections && collections.length > 0 ? collections
              .filter(collection => showInactive || collection.isActive)
              .map((collection) => (
              <div
                key={collection.id}
                className={cn(
                  "border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg",
                  collection.isActive ? "cursor-pointer" : "cursor-not-allowed",
                  selectedCollections.includes(collection.id)
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50",
                  !collection.isActive && "opacity-60"
                )}
                onClick={() => collection.isActive && handleCollectionToggle(collection.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => handleCollectionToggle(collection.id)}
                    disabled={!collection.isActive}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{collection.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {collection._count?.CollectionProduct || 0} products
                    </p>
                    {collection.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    {collection.image && (
                      <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                        collection.isActive 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                      )}>
                        {collection.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {collection.isFeatured && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200">
                          Featured
                        </span>
                      )}
                      {!collection.isActive && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 border-orange-200">
                          ⚠️ Inactive collections won't show on homepage
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No collections found</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Collections Preview */}
        {selectedCollections.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Selected Collections ({selectedCollections.length})
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Preview of how collections will appear on the homepage (drag to reorder)
            </p>
            
            <div className="space-y-3">
              {getSelectedCollectionDetails().map((collection, index) => (
                <div
                  key={collection.id}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-card"
                >
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveCollection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveCollection(index, 'down')}
                      disabled={index === selectedCollections.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex items-center space-x-4">
                    {collection.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{collection.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {collection._count?.CollectionProduct || 0} products
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Position: {index + 1}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCollectionToggle(collection.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">💡 How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Select collections from the available list to display on the homepage</li>
            <li>• Use the visibility toggle to show/hide the entire collection section</li>
            <li>• Reorder collections by using the up/down arrows in the preview</li>
            <li>• Only active collections will appear on the homepage (inactive ones are shown for reference)</li>
            <li>• Use the "Show inactive collections" checkbox to see all collections</li>
            <li>• Changes take effect immediately after saving</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
