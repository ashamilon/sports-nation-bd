"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings,
  Menu,
  ChevronDown,
  Save,
  X
} from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

interface MenuConfig {
  id: string
  menuType: string
  title: string
  collections: string
  isActive: boolean
  sortOrder: number
  metadata?: string
  createdAt: string
  updatedAt: string
}

export default function MenuConfigPage() {
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    menuType: 'header',
    title: '',
    collections: [] as string[],
    isActive: true,
    sortOrder: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menuResponse, collectionsResponse] = await Promise.all([
        fetch('/api/cms/menu-config'),
        fetch('/api/collections?isActive=true')
      ])

      const menuData = await menuResponse.json()
      const collectionsData = await collectionsResponse.json()

      if (menuData.success) {
        setMenuConfigs(menuData.data)
      }

      if (collectionsData.success) {
        setCollections(collectionsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/cms/menu-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setMenuConfigs([...menuConfigs, result.data])
        setIsCreating(false)
        setFormData({
          menuType: 'header',
          title: '',
          collections: [],
          isActive: true,
          sortOrder: 0
        })
      } else {
        alert('Error creating menu config: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating menu config:', error)
      alert('Error creating menu config')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/cms/menu-config/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setMenuConfigs(menuConfigs.map(config => 
          config.id === id ? result.data : config
        ))
        setEditingId(null)
        setFormData({
          menuType: 'header',
          title: '',
          collections: [],
          isActive: true,
          sortOrder: 0
        })
      } else {
        alert('Error updating menu config: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating menu config:', error)
      alert('Error updating menu config')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu configuration?')) {
      return
    }

    try {
      const response = await fetch(`/api/cms/menu-config/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setMenuConfigs(menuConfigs.filter(config => config.id !== id))
      } else {
        alert('Error deleting menu config: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting menu config:', error)
      alert('Error deleting menu config')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/cms/menu-config/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      const result = await response.json()

      if (result.success) {
        setMenuConfigs(menuConfigs.map(config => 
          config.id === id ? { ...config, isActive: !isActive } : config
        ))
      } else {
        alert('Error updating menu config: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating menu config:', error)
      alert('Error updating menu config')
    }
  }

  const startEdit = (config: MenuConfig) => {
    setEditingId(config.id)
    setFormData({
      menuType: config.menuType,
      title: config.title,
      collections: JSON.parse(config.collections),
      isActive: config.isActive,
      sortOrder: config.sortOrder
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      menuType: 'header',
      title: '',
      collections: [],
      isActive: true,
      sortOrder: 0
    })
  }

  const toggleCollection = (collectionId: string) => {
    setFormData(prev => ({
      ...prev,
      collections: prev.collections.includes(collectionId)
        ? prev.collections.filter(id => id !== collectionId)
        : [...prev.collections, collectionId]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Configuration</h1>
          <p className="text-muted-foreground">
            Manage dropdown menus for header navigation
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-4">
            {isCreating ? 'Create New Menu' : 'Edit Menu'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Menu Type
              </label>
              <select
                value={formData.menuType}
                onChange={(e) => setFormData(prev => ({ ...prev, menuType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Sports Collection"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                Active
              </label>
            </div>
          </div>

          {/* Collections Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Collections
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {collections.map((collection) => (
                <label key={collection.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.collections.includes(collection.id)}
                    onChange={() => toggleCollection(collection.id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{collection.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={isCreating ? handleCreate : () => handleUpdate(editingId!)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isCreating ? 'Create' : 'Update'}</span>
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Menu Configs List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-foreground">Menu Configurations</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {menuConfigs.map((config) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Menu className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{config.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {config.menuType} • Order: {config.sortOrder} • 
                        Collections: {JSON.parse(config.collections).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(config.id, config.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      config.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {config.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => startEdit(config)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {menuConfigs.length === 0 && (
          <div className="p-12 text-center">
            <Menu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No menu configurations</h3>
            <p className="text-muted-foreground mb-4">
              Create your first menu configuration to get started
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
