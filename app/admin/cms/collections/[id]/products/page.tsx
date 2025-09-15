"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Package, 
  Star, 
  Eye, 
  Trash2,
  ArrowLeft,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count: {
    children: number
    products: number
  }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  averageRating: number
  reviewCount: number
  variants: any[]
}

interface CollectionProduct {
  id: string
  collectionId: string
  productId: string
  sortOrder: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  product: Product
}

export default function CollectionProductsPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.id as string

  const [collection, setCollection] = useState<Collection | null>(null)
  const [collectionProducts, setCollectionProducts] = useState<CollectionProduct[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (collectionId) {
      fetchCollection()
      fetchCollectionProducts()
      fetchAllProducts()
    }
  }, [collectionId])

  const fetchCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`)
      const data = await response.json()
      
      if (data.success) {
        setCollection(data.data)
      } else {
        toast.error('Failed to fetch collection')
        router.push('/admin/cms/collections')
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
      toast.error('Failed to fetch collection')
      router.push('/admin/cms/collections')
    }
  }

  const fetchCollectionProducts = async () => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/products`)
      const data = await response.json()
      
      if (data.success) {
        setCollectionProducts(data.data)
      } else {
        toast.error('Failed to fetch collection products')
      }
    } catch (error) {
      console.error('Error fetching collection products:', error)
      toast.error('Failed to fetch collection products')
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (data.success) {
        setAllProducts(data.data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product')
      return
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProducts
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${selectedProducts.length} products added to collection`)
        setIsAddDialogOpen(false)
        setSelectedProducts([])
        fetchCollectionProducts()
      } else {
        toast.error(data.error || 'Failed to add products')
      }
    } catch (error) {
      console.error('Error adding products:', error)
      toast.error('Failed to add products')
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from the collection?')) {
      return
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product removed from collection')
        fetchCollectionProducts()
      } else {
        toast.error(data.error || 'Failed to remove product')
      }
    } catch (error) {
      console.error('Error removing product:', error)
      toast.error('Failed to remove product')
    }
  }

  const handleToggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getAvailableProducts = () => {
    const collectionProductIds = collectionProducts.map(cp => cp.productId)
    return allProducts.filter(product => !collectionProductIds.includes(product.id))
  }

  const filteredCollectionProducts = collectionProducts.filter(cp => 
    cp.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAvailableProducts = getAvailableProducts().filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!collection) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Collection not found</h3>
          <Button onClick={() => router.push('/admin/cms/collections')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/cms/collections')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              <p className="text-muted-foreground">
                Manage products in this collection
              </p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Products to Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredAvailableProducts.map(product => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedProducts.includes(product.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleToggleProductSelection(product.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${product.price}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">
                              {product.averageRating.toFixed(1)} ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                        
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleToggleProductSelection(product.id)}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredAvailableProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No products found matching your search' : 'All products are already in this collection'}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProducts}
                    disabled={selectedProducts.length === 0}
                  >
                    Add {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Collection Info */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-primary" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{collection.name}</h2>
              <p className="text-muted-foreground">
                {collection.description || 'No description'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={collection.isActive ? 'default' : 'secondary'}>
                  {collection.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {collection.isFeatured && (
                  <Badge variant="outline">Featured</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {collectionProducts.length} products
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products in collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredCollectionProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products in collection</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Add products to this collection to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Products
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
              {filteredCollectionProducts.map((collectionProduct) => (
                <motion.div
                  key={collectionProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                >
                  {viewMode === 'grid' ? (
                    <div className="space-y-3">
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                        {collectionProduct.product.images && collectionProduct.product.images.length > 0 ? (
                          <Image
                            src={collectionProduct.product.images[0]}
                            alt={collectionProduct.product.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold line-clamp-2">{collectionProduct.product.name}</h3>
                        <p className="text-sm text-muted-foreground">${collectionProduct.product.price}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {collectionProduct.product.averageRating.toFixed(1)} ({collectionProduct.product.reviewCount})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {collectionProduct.isFeatured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(collectionProduct.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {collectionProduct.product.images && collectionProduct.product.images.length > 0 ? (
                          <Image
                            src={collectionProduct.product.images[0]}
                            alt={collectionProduct.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{collectionProduct.product.name}</h3>
                        <p className="text-sm text-muted-foreground">${collectionProduct.product.price}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {collectionProduct.product.averageRating.toFixed(1)} ({collectionProduct.product.reviewCount})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {collectionProduct.isFeatured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(collectionProduct.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

