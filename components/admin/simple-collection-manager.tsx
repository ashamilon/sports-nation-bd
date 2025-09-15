"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, X, Search, Check } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  isFeatured: boolean
  _count: {
    products: number
  }
}

interface Product {
  id: string
  name: string
  price: number
  images?: string[]
}

interface SimpleCollectionManagerProps {
  product: Product
  onUpdate?: () => void
}

export default function SimpleCollectionManager({ product, onUpdate }: SimpleCollectionManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchCollections()
      fetchProductCollections()
    }
  }, [isOpen, product.id])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections?includeChildren=true')
      const data = await response.json()
      
      console.log('Collections API Response:', data) // Debug log
      
      if (response.ok) {
        const collectionsData = data.data || data.collections || []
        console.log('Setting collections:', collectionsData) // Debug log
        setCollections(collectionsData)
      } else {
        console.error('Collections API Error:', data)
        toast.error('Failed to fetch collections')
      }
    } catch (error) {
      console.error('Collections fetch error:', error)
      toast.error('Failed to fetch collections')
    }
  }

  const fetchProductCollections = async () => {
    try {
      const response = await fetch(`/api/products/${product.id}/collections`)
      const data = await response.json()
      
      if (response.ok) {
        setSelectedCollections(data.collections?.map((c: any) => c.id) || [])
      }
    } catch (error) {
      console.error('Failed to fetch product collections:', error)
    }
  }

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${product.id}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collectionIds: selectedCollections
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product collections')
      }

      toast.success('Product collections updated successfully!')
      onUpdate?.()
      setIsOpen(false)
    } catch (error) {
      console.error('Error updating product collections:', error)
      toast.error('Failed to update product collections')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (collections.length === 0 && isOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">No Collections Found</h3>
          <p className="text-muted-foreground mb-4">
            You need to create collections first before adding products to them.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false)
                window.open('/admin/cms/collections', '_blank')
              }}
            >
              Create Collections
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="glass-button p-2 rounded-lg"
        title="Manage Collections"
        onClick={() => setIsOpen(true)}
      >
        <Package className="h-4 w-4" />
      </motion.button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manage Collections for "{product.name}"
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              {/* Collections List */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Available Collections:</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredCollections.map((collection) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCollections.includes(collection.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => handleCollectionToggle(collection.id)}
                    >
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        selectedCollections.includes(collection.id)
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedCollections.includes(collection.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {collection.name}
                          </span>
                          {collection.isFeatured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                          {!collection.isActive && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {collection._count.products} products
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
