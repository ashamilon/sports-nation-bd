"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff,
  Filter,
  Save,
  X,
  Award
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface Badge {
  id: string
  name: string
  description?: string
  image: string
  category: string
  price: number
  isActive: boolean
  createdAt: string
}

const badgeCategories = [
  { id: 'premier-league', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', icon: '🇪🇸' },
  { id: 'serie-a', name: 'Serie A', icon: '🇮🇹' },
  { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { id: 'champions-league', name: 'UEFA Competitions', icon: '🏆' },
  { id: 'national-teams', name: 'National Teams', icon: '🌍' },
  { id: 'other', name: 'Other', icon: '⚽' }
]

export default function SimpleBadgeManagement() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    price: 150,
    isActive: true
  })

  useEffect(() => {
    fetchBadges()
  }, [])

  // Populate form when editing a badge
  useEffect(() => {
    if (editingBadge) {
      setFormData({
        name: editingBadge.name,
        description: editingBadge.description || '',
        image: editingBadge.image,
        category: editingBadge.category,
        price: editingBadge.price,
        isActive: editingBadge.isActive
      })
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        category: '',
        price: 150,
        isActive: true
      })
    }
  }, [editingBadge])

  const fetchBadges = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (showActiveOnly) {
        params.append('isActive', 'true')
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/badges?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBadges(data.badges || [])
      } else {
        toast.error(data.error || 'Failed to fetch badges')
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
      toast.error('Failed to fetch badges')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBadges()
  }, [selectedCategory, showActiveOnly, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/badges/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }))
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.image || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      let updatedBadges: Badge[]
      
      if (editingBadge) {
        // Update existing badge
        updatedBadges = badges.map(badge => 
          badge.id === editingBadge.id 
            ? { ...badge, ...formData }
            : badge
        )
      } else {
        // Add new badge
        const newBadge: Badge = {
          id: `badge-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString()
        }
        updatedBadges = [...badges, newBadge]
      }

      // Save to JSON file
      const response = await fetch('/api/badges/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      })

      if (response.ok) {
        setBadges(updatedBadges)
        toast.success(editingBadge ? 'Badge updated successfully!' : 'Badge added successfully!')
        
        setShowForm(false)
        setEditingBadge(null)
        setFormData({
          name: '',
          description: '',
          image: '',
          category: '',
          price: 150,
          isActive: true
        })
      } else {
        throw new Error('Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving badge:', error)
      toast.error('Failed to save badge')
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return badgeCategories.find(cat => cat.id === categoryId) || { name: categoryId, icon: '⚽' }
  }

  const handleToggleStatus = async (badgeId: string, currentStatus: boolean) => {
    try {
      const updatedBadges = badges.map(badge => 
        badge.id === badgeId ? { ...badge, isActive: !currentStatus } : badge
      )
      
      // Save to JSON file
      const response = await fetch('/api/badges/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badges: updatedBadges }),
      })

      if (response.ok) {
        setBadges(updatedBadges)
        toast.success(`Badge ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      } else {
        throw new Error('Failed to save changes')
      }
    } catch (error) {
      console.error('Error toggling badge status:', error)
      toast.error('Failed to update badge status')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Football Badges</h1>
          <p className="text-muted-foreground">Manage badges for product customization</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Badge</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-3 py-2 rounded-lg w-full md:w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-3 py-2 rounded-lg"
            >
              <option value="all">All Categories</option>
              {badgeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* Active Filter */}
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`glass-button px-3 py-2 rounded-lg flex items-center space-x-2 ${
                showActiveOnly ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {showActiveOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Active Only</span>
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            {badges.length} badge{badges.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading badges...</p>
        </div>
      ) : badges.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No badges found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' || showActiveOnly
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first badge.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && !showActiveOnly && (
            <button
              onClick={() => setShowForm(true)}
              className="glass-button px-4 py-2 rounded-lg"
            >
              Add First Badge
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const categoryInfo = getCategoryInfo(badge.category)
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-4 rounded-xl ${
                  !badge.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="space-y-3">
                  {/* Badge Image */}
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-sm relative">
                    <Image
                      src={badge.image}
                      alt={badge.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-badge.svg'
                        target.className = 'w-full h-full object-contain p-2 opacity-50'
                      }}
                      unoptimized={true}
                    />
                    {badge.image === '/placeholder-badge.svg' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                        <div className="text-center">
                          <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badge Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                        {badge.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {categoryInfo.icon}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {badge.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        ৳{badge.price}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        badge.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {badge.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Badge Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(badge.id, badge.isActive)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        badge.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      }`}
                      title={`${badge.isActive ? 'Deactivate' : 'Activate'} badge`}
                    >
                      {badge.isActive ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingBadge(badge)
                          setShowForm(true)
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit badge"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this badge?')) {
                            try {
                              const updatedBadges = badges.filter(b => b.id !== badge.id)
                              
                              // Save to JSON file
                              const response = await fetch('/api/badges/update', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ badges: updatedBadges }),
                              })

                              if (response.ok) {
                                setBadges(updatedBadges)
                                toast.success('Badge deleted successfully!')
                              } else {
                                throw new Error('Failed to save changes')
                              }
                            } catch (error) {
                              console.error('Error deleting badge:', error)
                              toast.error('Failed to delete badge')
                            }
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete badge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add Badge Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/95 backdrop-blur-md border border-blue-100/50 shadow-2xl p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingBadge ? 'Edit Badge' : 'Add New Badge'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingBadge(null)
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Badge Image */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Badge Image *</label>
                
                {formData.image ? (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/90 border border-blue-100/60 shadow-sm">
                      <Image
                        src={formData.image}
                        alt="Badge preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-badge.svg'
                        }}
                        unoptimized={true}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-blue-200/60 rounded-lg p-6 text-center bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                    <Upload className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-foreground mb-2">Upload badge image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 rounded-lg cursor-pointer inline-block text-sm bg-white/80 border border-blue-100/60 text-foreground hover:bg-white hover:border-primary/30 transition-all"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Badge Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/80 border border-blue-100/60 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    placeholder="e.g., Arsenal FC"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/80 border border-blue-100/60 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      required
                    >
                      <option value="">Select category</option>
                      {badgeCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
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
                      className="w-full px-3 py-2 rounded-lg bg-white/80 border border-blue-100/60 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      placeholder="150"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-white/80 border border-blue-100/60 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all min-h-[80px] resize-none"
                    placeholder="Brief description of the badge..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">Active</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-blue-100/40">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBadge(null)
                  }}
                  className="px-4 py-2 rounded-lg bg-white/80 border border-blue-100/60 text-foreground hover:bg-white hover:border-primary/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingBadge ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
