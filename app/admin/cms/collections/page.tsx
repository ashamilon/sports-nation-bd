"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  FolderPlus, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
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

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Collection
  children?: Collection[]
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count: {
    other_Collection: number
    CollectionProduct: number
  }
}

interface CollectionFormData {
  name: string
  description: string
  image: string
  parentId: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
}

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParent, setSelectedParent] = useState<string>('all')
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0
  })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/collections?includeChildren=true&_t=${Date.now()}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setCollections(data.data)
      } else {
        toast.error('Failed to fetch collections')
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Collection created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        // Add a small delay to ensure the database is updated
        setTimeout(() => {
          fetchCollections()
        }, 100)
      } else {
        toast.error(data.error || 'Failed to create collection')
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Failed to create collection')
    }
  }

  const handleUpdateCollection = async () => {
    if (!editingCollection) return

    try {
      const response = await fetch(`/api/collections/${editingCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Collection updated successfully')
        setIsEditDialogOpen(false)
        setEditingCollection(null)
        resetForm()
        // Add a small delay to ensure the database is updated
        setTimeout(() => {
          fetchCollections()
        }, 100)
      } else {
        toast.error(data.error || 'Failed to update collection')
      }
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('Failed to update collection')
    }
  }

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Collection deleted successfully')
        // Add a small delay to ensure the database is updated
        setTimeout(() => {
          fetchCollections()
        }, 100)
      } else {
        toast.error(data.error || 'Failed to delete collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      image: collection.image || '',
      parentId: collection.parentId || '',
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      sortOrder: collection.sortOrder
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      parentId: '',
      isActive: true,
      isFeatured: false,
      sortOrder: 0
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered:', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log('File converted to base64, length:', result.length)
        setFormData({ ...formData, image: result })
        toast.success('Image uploaded successfully!')
      }
      reader.onerror = () => {
        toast.error('Failed to read file')
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCollections(newExpanded)
  }

  const getParentCollections = () => {
    return collections.filter(c => !c.parentId)
  }

  const getChildCollections = (parentId: string) => {
    return collections.filter(c => c.parentId === parentId)
  }

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesParent = selectedParent === 'all' || 
                         (selectedParent === 'null' && !collection.parentId) ||
                         collection.parentId === selectedParent
    return matchesSearch && matchesParent
  })

  const renderCollectionRow = (collection: Collection, level: number = 0) => {
    const hasChildren = collection._count.other_Collection > 0
    const isExpanded = expandedCollections.has(collection.id)
    const children = getChildCollections(collection.id)

    return (
      <div key={collection.id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 mb-2 ${level > 0 ? 'ml-6' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(collection.id)}
                  className="p-1 hover:bg-muted rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              
              <div className="flex items-center gap-3">
                {collection.image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                        if (nextElement) {
                          nextElement.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                <div>
                  <h3 
                    className="font-semibold cursor-pointer hover:text-primary transition-colors"
                    onClick={() => router.push(`/admin/cms/collections/${collection.id}/products`)}
                  >
                    {collection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={collection.isActive ? 'default' : 'secondary'}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {collection.isFeatured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {collection._count.CollectionProduct} products
                    </span>
                    {collection._count.other_Collection > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {collection._count.other_Collection} sub-collections
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/cms/collections/${collection.id}/products`)}
                title="View Products"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditCollection(collection)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDeleteCollection(collection.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {children.map(child => renderCollectionRow(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Collections</h1>
            <p className="text-muted-foreground">
              Manage your product collections and sub-collections
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Collection name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Collection description"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Collection Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload-create"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById('image-upload-create')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Or select a file: 
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="ml-2 text-xs"
                      />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <label className="text-xs text-muted-foreground">Preview:</label>
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border">
                        <img 
                          src={formData.image} 
                          alt="Collection preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                            if (nextElement) {
                              nextElement.style.display = 'flex'
                            }
                          }}
                        />
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center" style={{display: 'none'}}>
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Parent Collection</label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">No parent (Root collection)</option>
                    {getParentCollections().map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    Featured
                  </label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection}>
                    Create Collection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Collections</option>
            <option value="null">Root Collections</option>
            {getParentCollections().map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Collections List */}
        <div className="space-y-2">
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No collections found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              )}
            </div>
          ) : (
            filteredCollections
              .filter(c => !c.parentId) // Only show root collections initially
              .map(collection => renderCollectionRow(collection))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Collection name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Collection description"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Collection Image</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-edit"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('image-upload-edit')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Or select a file: 
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="ml-2 text-xs"
                    />
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <label className="text-xs text-muted-foreground">Preview:</label>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border">
                      <img 
                        src={formData.image} 
                        alt="Collection preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                          if (nextElement) {
                            nextElement.style.display = 'flex'
                          }
                        }}
                      />
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center" style={{display: 'none'}}>
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Parent Collection</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">No parent (Root collection)</option>
                  {getParentCollections()
                    .filter(c => c.id !== editingCollection?.id) // Don't allow self as parent
                    .map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCollection}>
                  Update Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
