"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Package, Plus, X, Search } from 'lucide-react'

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
  collections?: Collection[]
}

interface ProductCollectionsManagerProps {
  product: Product
  onUpdate?: () => void
}

export default function ProductCollectionsManager({ product, onUpdate }: ProductCollectionsManagerProps) {
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
      
      if (response.ok) {
        setCollections(data.collections || [])
      } else {
        toast.error('Failed to fetch collections')
      }
    } catch (error) {
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
      // Remove product from all collections first
      for (const collection of collections) {
        if (product.collections?.some(pc => pc.id === collection.id)) {
          await fetch(`/api/collections/${collection.id}/products/${product.id}`, {
            method: 'DELETE'
          })
        }
      }

      // Add product to selected collections
      for (const collectionId of selectedCollections) {
        await fetch(`/api/collections/${collectionId}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            sortOrder: 0,
            isFeatured: false
          })
        })
      }

      toast.success('Product collections updated successfully!')
      setIsOpen(false)
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to update product collections')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="glass-button p-2 rounded-lg"
          title="Manage Collections"
        >
          <Package className="h-4 w-4" />
        </motion.button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manage Collections for "{product.name}"
          </DialogTitle>
        </DialogHeader>

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

          {/* Current Collections */}
          {product.collections && product.collections.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Current Collections:</h4>
              <div className="flex flex-wrap gap-2">
                {product.collections.map((collection) => (
                  <Badge key={collection.id} variant="secondary" className="flex items-center gap-1">
                    {collection.name}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Collections List */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Available Collections:</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCollections.map((collection) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={collection.id}
                    checked={selectedCollections.includes(collection.id)}
                    onCheckedChange={() => handleCollectionToggle(collection.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={collection.id}
                        className="font-medium text-foreground cursor-pointer"
                      >
                        {collection.name}
                      </label>
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
      </DialogContent>
    </Dialog>
  )
}

