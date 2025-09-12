"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface ProductVariant {
  id?: string
  name: string
  value: string
  price: number
  stock: number
}

interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  price: number
  comparePrice: number
  sku: string
  stock: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  weight: number
  dimensions: string
  variants: ProductVariant[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: 0,
    comparePrice: 0,
    sku: '',
    stock: 0,
    isActive: true,
    isFeatured: false,
    weight: 0,
    dimensions: ''
  })

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
    fetchCategories()
  }, [productId])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (response.ok) {
        setCategories(data.categories || [])
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const product: Product = await response.json()

      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      setFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        comparePrice: product.comparePrice || 0,
        sku: product.sku,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        weight: product.weight || 0,
        dimensions: product.dimensions || ''
      })

      // Ensure images is an array
      const productImages = Array.isArray(product.images) ? product.images : []
      setImages(productImages)
      setVariants(product.variants || [])
    } catch (error) {
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))

    // Auto-generate variants when category changes
    if (name === 'categoryId') {
      generateVariantsForCategory(value)
    }

    // Update variant prices when base price changes
    if (name === 'price' && variants.length > 0) {
      const newPrice = parseFloat(value) || 0
      setVariants(prev => prev.map(variant => ({
        ...variant,
        price: newPrice
      })))
    }
  }

  const generateVariantsForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return

    let newVariants: ProductVariant[] = []

    if (category.slug === 'jerseys') {
      // Generate jersey variants: Separate Size and Fabric options
      const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      const fabrics = ['Fan Version', 'Player Version']
      
      // Add size variants
      sizes.forEach(size => {
        newVariants.push({
          name: 'Size',
          value: size,
          price: formData.price, // Set to current base price
          stock: 0
        })
      })
      
      // Add fabric variants
      fabrics.forEach(fabric => {
        newVariants.push({
          name: 'Fabric',
          value: fabric,
          price: formData.price, // Set to current base price
          stock: 0
        })
      })
    } else if (category.slug === 'sneakers') {
      // Generate sneaker variants: Sizes 25-46
      for (let size = 25; size <= 46; size++) {
        newVariants.push({
          name: 'Size',
          value: size.toString(),
          price: formData.price, // Set to current base price
          stock: 0
        })
      }
    }

    setVariants(newVariants)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, {
      name: '',
      value: '',
      price: 0,
      stock: 0
    }])
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images,
          variants
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products" className="glass-button p-2 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    placeholder="Enter SKU"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price (BDT) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Compare Price (BDT)</label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="glass-input w-full px-3 py-2 rounded-lg min-h-[120px]"
                  placeholder="Enter product description"
                  required
                />
              </div>
            </motion.div>

            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload product images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="glass-button px-4 py-2 rounded-lg cursor-pointer inline-block"
                  >
                    Choose Images
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Variants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Product Variants</h2>
                  {variants.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {variants.length} variants generated automatically
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="glass-button px-3 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Variant</span>
                </button>
              </div>

              {variants.length > 0 ? (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="glass-card p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">Variant {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-sm text-muted-foreground">Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            className="glass-input w-full px-2 py-1 rounded text-sm"
                            placeholder="e.g., Size, Color"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Value</label>
                          <input
                            type="text"
                            value={variant.value}
                            onChange={(e) => updateVariant(index, 'value', e.target.value)}
                            className="glass-input w-full px-2 py-1 rounded text-sm"
                            placeholder="e.g., Large, Red"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Price</label>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                            className="glass-input w-full px-2 py-1 rounded text-sm"
                            placeholder="0"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Stock</label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                            className="glass-input w-full px-2 py-1 rounded text-sm"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No variants added. Click "Add Variant" to create product variations.
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Status & Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Featured</span>
                </label>
              </div>
            </motion.div>

            {/* Physical Properties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Physical Properties</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg mt-1"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Dimensions (L x W x H)</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="glass-input w-full px-3 py-2 rounded-lg mt-1"
                    placeholder="e.g., 10 x 5 x 2 cm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full glass-button py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Update Product'}
                </button>
                
                <Link
                  href="/admin/products"
                  className="w-full glass-button py-3 rounded-lg text-center block"
                >
                  Cancel
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}
