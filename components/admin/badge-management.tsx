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
  X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import BadgeForm from './badge-form'

interface Badge {
  id: string
  name: string
  description?: string
  image: string
  category: string
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
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

export default function BadgeManagement() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null)

  useEffect(() => {
    fetchBadges()
  }, [])

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

      const response = await fetch(`/api/admin/badges?${params}`)
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

  const handleDeleteBadge = async (badgeId: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Badge deleted successfully')
        fetchBadges()
      } else {
        toast.error(data.error || 'Failed to delete badge')
      }
    } catch (error) {
      console.error('Error deleting badge:', error)
      toast.error('Failed to delete badge')
    }
  }

  const handleToggleActive = async (badgeId: string, isActive: boolean) => {
    try {
      const badge = badges.find(b => b.id === badgeId)
      if (!badge) return

      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...badge,
          isActive: !isActive
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Badge ${!isActive ? 'activated' : 'deactivated'} successfully`)
        fetchBadges()
      } else {
        toast.error(data.error || 'Failed to update badge')
      }
    } catch (error) {
      console.error('Error updating badge:', error)
      toast.error('Failed to update badge')
    }
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingBadge(null)
    fetchBadges()
  }

  const getCategoryInfo = (categoryId: string) => {
    return badgeCategories.find(cat => cat.id === categoryId) || { name: categoryId, icon: '⚽' }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Badge Management</h1>
          <p className="text-muted-foreground">Manage football badges for product customization</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
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
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-white border border-border">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-badge.svg'
                      }}
                    />
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

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingBadge(badge)
                        setShowForm(true)
                      }}
                      className="flex-1 glass-button py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(badge.id, badge.isActive)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        badge.isActive 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                          : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {badge.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteBadge(badge.id)}
                      className="px-3 py-2 rounded-lg text-sm bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Badge Form Modal */}
      {showForm && (
        <BadgeForm
          badge={editingBadge}
          onClose={() => {
            setShowForm(false)
            setEditingBadge(null)
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
