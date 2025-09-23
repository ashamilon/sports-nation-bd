"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Upload, Save, X, ChevronDown, ChevronRight, Folder, FolderOpen, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import ImageUpload from '@/components/ui/image-upload'

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
  isInCarousel: boolean
  carouselOrder?: number
  metadata?: string
  createdAt: string
  updatedAt: string
  _count?: {
    CollectionProduct: number
  }
  Collection?: Collection[] // Sub-collections
  CollectionProduct?: any[]
}

export default function CollectionsCMS() {
  const { data: session } = useSession()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: 'null',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    isInCarousel: false,
    carouselOrder: 0,
    metadata: ''
  })

  // Fetch collections with sub-collections
  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections?includeChildren=true')
      if (response.ok) {
        const data = await response.json()
        setCollections(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    const handleCollectionsUpdate = () => {
      console.log('Collections updated - refetching data')
      fetchCollections()
    }

    window.addEventListener('collections-updated', handleCollectionsUpdate)
    
    return () => {
      window.removeEventListener('collections-updated', handleCollectionsUpdate)
    }
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when name changes
    if (field === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  // Handle inline edit start
  const handleInlineEdit = (collection: Collection) => {
    setEditingId(collection.id)
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image: collection.image || '',
      parentId: collection.parentId || 'null',
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      sortOrder: collection.sortOrder,
      isInCarousel: collection.isInCarousel,
      carouselOrder: collection.carouselOrder || 0,
      metadata: collection.metadata || ''
    })
  }

  // Handle inline edit save
  const handleInlineSave = async (id: string) => {
    try {
      // Convert "null" string back to null for API
      const submitData = {
        ...formData,
        parentId: formData.parentId === 'null' ? null : formData.parentId
      }
      
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success('Collection updated successfully')
        setEditingId(null)
        fetchCollections()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update collection')
      }
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('Failed to update collection')
    }
  }

  // Handle inline edit cancel
  const handleInlineCancel = () => {
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: 'null',
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      isInCarousel: false,
      carouselOrder: 0,
      metadata: ''
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCollection 
        ? `/api/collections/${editingCollection.id}`
        : '/api/collections'
      
      const method = editingCollection ? 'PUT' : 'POST'
      
      // Convert "null" string back to null for API
      const submitData = {
        ...formData,
        parentId: formData.parentId === 'null' ? null : formData.parentId
      }
      
      console.log('Submitting collection data:', submitData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success(editingCollection ? 'Collection updated successfully' : 'Collection created successfully')
        setIsDialogOpen(false)
        setEditingCollection(null)
        resetForm()
        
        // Force refresh collections data
        await fetchCollections()
        
        // Also trigger manual refresh event as backup
        window.dispatchEvent(new CustomEvent('collections-updated', {
          detail: { timestamp: Date.now() }
        }))
      } else {
        const error = await response.json()
        console.error('API Error:', response.status, error)
        toast.error(error.message || 'Failed to save collection')
      }
    } catch (error) {
      console.error('Error saving collection:', error)
      toast.error('Failed to save collection')
    }
  }

  // Handle edit (for dialog)
  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image: collection.image || '',
      parentId: collection.parentId || 'null',
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      sortOrder: collection.sortOrder,
      isInCarousel: collection.isInCarousel,
      carouselOrder: collection.carouselOrder || 0,
      metadata: collection.metadata || ''
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Collection deleted successfully')
        fetchCollections()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: 'null',
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      isInCarousel: false,
      carouselOrder: 0,
      metadata: ''
    })
  }

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingCollection(null)
      resetForm()
    }
  }

  // Handle add collection button
  const handleAddCollection = () => {
    setEditingCollection(null)
    resetForm()
    setIsDialogOpen(true)
  }

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Get parent collections for select
  const getParentCollections = () => {
    return collections.filter(c => !c.parentId)
  }

  // Get sub-collections for a parent
  const getSubCollections = (parentId: string) => {
    return collections.filter(c => c.parentId === parentId)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading collections...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Collections Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product collections in listed mode with full editing capabilities
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCollections} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddCollection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Collection
          </Button>
        </div>
        
             <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
               
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                   <DialogTitle>
                     {editingCollection ? 'Edit Collection' : 'Add New Collection'}
                   </DialogTitle>
                   <DialogDescription>
                     {editingCollection ? 'Update collection details' : 'Create a new collection for your homepage'}
                   </DialogDescription>
                 </DialogHeader>
                 
                 <form onSubmit={handleSubmit} className="space-y-6">
                   {/* Basic Information */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-medium">Basic Information</h3>
                     
                     <div>
                       <Label htmlFor="name">Collection Name *</Label>
                       <Input
                         id="name"
                         value={formData.name}
                         onChange={(e) => handleInputChange('name', e.target.value)}
                         placeholder="e.g., Summer Collection"
                         required
                         className="mt-1"
                       />
                     </div>
                     
                     <div>
                       <Label htmlFor="description">Description</Label>
                       <Textarea
                         id="description"
                         value={formData.description}
                         onChange={(e) => handleInputChange('description', e.target.value)}
                         placeholder="Describe this collection..."
                         rows={3}
                         className="mt-1"
                       />
                     </div>
                   </div>

                   {/* Image Upload */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-medium">Collection Image</h3>
                     
                     <ImageUpload
                       value={formData.image}
                       onChange={(value) => handleInputChange('image', value)}
                       placeholder="https://example.com/image.jpg"
                     />
                   </div>

                   {/* Collection Settings */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-medium">Settings</h3>
                     
                     <div>
                       <Label htmlFor="parentId">Parent Collection</Label>
                       <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select parent collection (optional)" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="null">No Parent (Top Level)</SelectItem>
                           {getParentCollections().map((collection) => (
                             <SelectItem key={collection.id} value={collection.id}>
                               {collection.name}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-center space-x-2">
                         <Switch
                           id="isActive"
                           checked={formData.isActive}
                           onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                         />
                         <Label htmlFor="isActive">Active</Label>
                       </div>
                       
                       <div className="flex items-center space-x-2">
                         <Switch
                           id="isFeatured"
                           checked={formData.isFeatured}
                           onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                         />
                         <Label htmlFor="isFeatured">Featured</Label>
                       </div>
                     </div>

                     <div className="flex items-center space-x-2">
                       <Switch
                         id="isInCarousel"
                         checked={formData.isInCarousel}
                         onCheckedChange={(checked) => handleInputChange('isInCarousel', checked)}
                       />
                       <Label htmlFor="isInCarousel">Show in Carousel</Label>
                     </div>
                   </div>
                   
                   <DialogFooter className="gap-2">
                     <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                       Cancel
                     </Button>
                     <Button type="submit">
                       {editingCollection ? 'Update Collection' : 'Create Collection'}
                     </Button>
                   </DialogFooter>
                 </form>
               </DialogContent>
             </Dialog>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collections List</CardTitle>
          <CardDescription>
            Click on any field to edit inline, or use the expand button to view sub-collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Carousel Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>In Carousel</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.filter(collection => !collection.parentId).map((collection) => {
                  const isEditing = editingId === collection.id
                  const isExpanded = expandedRows.has(collection.id)
                  const subCollections = getSubCollections(collection.id)
                  
                  return (
                    <React.Fragment key={collection.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>
                          {subCollections.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(collection.id)}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              {collection.parentId ? (
                                <Folder className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <FolderOpen className="h-4 w-4 text-primary" />
                              )}
                              <span className="font-medium">{collection.name}</span>
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={formData.slug}
                              onChange={(e) => handleInputChange('slug', e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {collection.slug}
                            </code>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={formData.image}
                              onChange={(e) => handleInputChange('image', e.target.value)}
                              className="h-8"
                              placeholder="Image URL"
                            />
                          ) : (
                            <div className="w-12 h-8 rounded overflow-hidden bg-muted">
                              {collection.image ? (
                                <Image
                                  src={collection.image}
                                  alt={collection.name}
                                  width={48}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value)}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select parent" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="null">No Parent</SelectItem>
                                {getParentCollections().filter(c => c.id !== collection.id).map((parent) => (
                                  <SelectItem key={parent.id} value={parent.id}>
                                    {parent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {collection.parentId ? 
                                collections.find(c => c.id === collection.parentId)?.name || 'Unknown' 
                                : 'Top Level'
                              }
                            </span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline">
                            {collection._count?.CollectionProduct || 0}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={formData.sortOrder}
                              onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                              className="h-8 w-20"
                            />
                          ) : (
                            <span>{collection.sortOrder}</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={formData.carouselOrder}
                              onChange={(e) => handleInputChange('carouselOrder', parseInt(e.target.value) || 0)}
                              className="h-8 w-20"
                            />
                          ) : (
                            <span>{collection.carouselOrder || 0}</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Switch
                              checked={formData.isActive}
                              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                            />
                          ) : (
                            <Badge variant={collection.isActive ? "default" : "secondary"}>
                              {collection.isActive ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Switch
                              checked={formData.isFeatured}
                              onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                            />
                          ) : (
                            collection.isFeatured && (
                              <Badge variant="outline">Featured</Badge>
                            )
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Switch
                              checked={formData.isInCarousel}
                              onCheckedChange={(checked) => handleInputChange('isInCarousel', checked)}
                            />
                          ) : (
                            collection.isInCarousel && (
                              <Badge variant="outline">In Carousel</Badge>
                            )
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleInlineSave(collection.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleInlineCancel}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInlineEdit(collection)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(collection)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(collection.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                      
                      {/* Sub-collections */}
                      {isExpanded && subCollections.map((subCollection) => (
                        <TableRow key={subCollection.id} className="bg-muted/30">
                          <TableCell></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 pl-6">
                              <Folder className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{subCollection.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {subCollection.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="w-12 h-8 rounded overflow-hidden bg-muted">
                              {subCollection.image ? (
                                <Image
                                  src={subCollection.image}
                                  alt={subCollection.name}
                                  width={48}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {collection.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {subCollection._count?.CollectionProduct || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span>{subCollection.sortOrder}</span>
                          </TableCell>
                          <TableCell>
                            <span>{subCollection.carouselOrder || 0}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={subCollection.isActive ? "default" : "secondary"}>
                              {subCollection.isActive ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {subCollection.isFeatured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {subCollection.isInCarousel && (
                              <Badge variant="outline">In Carousel</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(subCollection)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(subCollection.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No collections found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first collection to get started
          </p>
          <Button onClick={handleAddCollection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Collection
          </Button>
        </div>
      )}
    </div>
  )
}