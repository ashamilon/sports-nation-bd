"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Star, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Search,
  Filter,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

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
  Category: {
    name: string
  }
  ExclusiveProductSettings?: {
    id: string
    isVisible: boolean
    sortOrder: number
  }
}

export default function ExclusiveProductsCMS() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showInactive, setShowInactive] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [showInactive])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (showInactive) params.append('includeInactive', 'true')
      
      const response = await fetch(`/api/cms/exclusive-products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleExclusive = async (productId: string, isVisible: boolean) => {
    try {
      const response = await fetch('/api/cms/exclusive-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: [productId],
          isVisible,
        }),
      })

      if (response.ok) {
        toast.success(`Product ${isVisible ? 'added to' : 'removed from'} exclusive section`)
        fetchProducts()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error updating product')
    }
  }

  const handleBulkAdd = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to add')
      return
    }

    try {
      const response = await fetch('/api/cms/exclusive-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          isVisible: true,
          sortOrder,
        }),
      })

      if (response.ok) {
        toast.success(`${selectedProducts.length} products added to exclusive section`)
        setSelectedProducts([])
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        toast.error('Failed to add products')
      }
    } catch (error) {
      console.error('Error adding products:', error)
      toast.error('Error adding products')
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/cms/exclusive-products?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product removed from exclusive section')
        fetchProducts()
      } else {
        toast.error('Failed to remove product')
      }
    } catch (error) {
      console.error('Error removing product:', error)
      toast.error('Error removing product')
    }
  }

  const handleSortOrderChange = async (productId: string, newSortOrder: number) => {
    try {
      const response = await fetch('/api/cms/exclusive-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: [productId],
          isVisible: true,
          sortOrder: newSortOrder,
        }),
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating sort order:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.Category.name === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.Category.name)))

  const exclusiveProducts = filteredProducts.filter(p => p.ExclusiveProductSettings)
  const availableProducts = filteredProducts.filter(p => !p.ExclusiveProductSettings)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exclusive Products Management</h1>
          <p className="text-muted-foreground">
            Manage which products appear in the Exclusive Products section on the homepage
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Products
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Products to Exclusive Section</DialogTitle>
              <DialogDescription>
                Select products to add to the exclusive section. They will be displayed in the order you select them.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sortOrder">Starting Sort Order:</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`cursor-pointer transition-all ${
                      selectedProducts.includes(product.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      if (selectedProducts.includes(product.id)) {
                        setSelectedProducts(prev => prev.filter(id => id !== product.id))
                      } else {
                        setSelectedProducts(prev => [...prev, product.id])
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.Category.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{product.averageRating}</span>
                            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                          </div>
                          <p className="text-sm font-medium">৳{product.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkAdd} disabled={selectedProducts.length === 0}>
                Add {selectedProducts.length} Products
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-48">
              <Label htmlFor="category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showInactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="showInactive">Show Inactive Products</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exclusive Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Exclusive Products ({exclusiveProducts.length})</span>
            <Badge variant="secondary">Currently Displayed</Badge>
          </CardTitle>
          <CardDescription>
            Products currently shown in the Exclusive Products section on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exclusiveProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products in exclusive section. Add some products to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exclusiveProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.Category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">৳{product.price}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{product.comparePrice}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{product.averageRating}</span>
                        <span className="text-muted-foreground">({product.reviewCount})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortOrderChange(product.id, (product.ExclusiveProductSettings?.sortOrder || 0) - 1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">
                          {product.ExclusiveProductSettings?.sortOrder || 0}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortOrderChange(product.id, (product.ExclusiveProductSettings?.sortOrder || 0) + 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.ExclusiveProductSettings?.isVisible || false}
                          onCheckedChange={(checked) => handleToggleExclusive(product.id, checked)}
                        />
                        <span className="text-sm">
                          {product.ExclusiveProductSettings?.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from Exclusive Section</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{product.name}" from the exclusive section? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveProduct(product.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
